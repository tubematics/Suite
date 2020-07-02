import os
import PySpin
import cv2
import numpy as np
import paho.mqtt.client as mqtt
import base64
import cherrypy as applyai
from datetime import timedelta
import datetime

from applyai_vision.scheduler import Schedule
from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode


class applyaiPlugin:

  class API(stdAPI):

    _streaming = True
    _lastFrame = np.full((2), None)
    _lastTimeUpdate = np.full((2), datetime.datetime.now())

    def __init__(self, name='Flir'):
      stdAPI.__init__(self, name)
      applyai.log('in init CameraFeed', self.logname)
      applyai.engine.subscribe('newframe', self.updateFrame)

    def updateFrame(self, frame):
      #self.store.update(self.name, pd.DataFrame(columns=['plugin']), frame, frame)
      #self.store.updateFrameIn(self.name, 0, frame)
      #self.store.updateFrameIn(self.name, 1, frame)
      applyaiPlugin.API._lastFrame = frame
      pass

    def genReturn(self, cam=0):
      cam = int(cam)
      """Video streaming generator function."""
      if applyaiPlugin.API._streaming:
        frame = self.store.fetchFrameIn(self.name, cam) # camera.get_frame()
        img = cv2.imencode('.jpg', frame)[1].tobytes()
        return (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + img + b'\r\n\r\n')

    @applyai.expose
    def feed(self, camera=0):
      img = self.genReturn(camera) #cameraFeed.cam)
      applyai.response.headers['Content-Type']= 'multipart/x-mixed-replace; boundary=frame'
      return img

    def genYield(self, cam=0):
      cam = int(cam)
      """Video streaming generator function."""
      while applyaiPlugin.API._streaming:
        frame = self.store.fetchFrameIn(self.name, cam) # camera.get_frame()
        img = cv2.imencode('.jpg', frame)[1].tobytes()
        yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + img + b'\r\n\r\n')

    @applyai.expose
    def stream(self, camera=0):
      img = self.genYield(camera) #cameraFeed.cam)
      applyai.response.headers['Content-Type']= 'multipart/x-mixed-replace; boundary=frame'
      return img

    @applyai.expose
    def trigger(self, camera=0):
      applyai.engine.publish('Camera/trigger', camera)
      applyai.response.headers['Content-Type'] = 'text/html'
      return 'Image updated camera ' + str(camera)

    @applyai.expose
    def index(self):
      print('in camera/index')
      html = applyaiPlugin.API._tp.render('testcamera', {})
      applyai.response.headers['Content-Type'] = 'text/html'
      return(html)

    stream._cp_config = {'response.stream': True}

    def main(self, params):

      #targets = params['targets']
      #channel = params['channel']
      #applyai.log('in main', self.logname)
      return params


  class PCode(stdPCode):
    
    def __init__(self, name='Flir'):
      stdPCode.__init__(self, name)
      self.maxCameras = 10
      self.init()
      self.frame = np.ones(shape=[512, 512, 3], dtype=np.uint8)
      applyai.engine.subscribe(self.name + '/monitorConfig', self.updateCriticalVariables)

      self.cameras = []
      # Retrieve singleton reference to system object
      self.system = PySpin.System.GetInstance()

      # Get current library version
      self.version = self.system.GetLibraryVersion()
      applyai.log('Library version: %d.%d.%d.%d' % (self.version.major, self.version.minor, self.version.type, self.version.build), self.logname)

      # Retrieve list of cameras from the system
      self.cam_list = self.system.GetCameras()

      self.num_cameras = self.cam_list.GetSize()
      applyai.log('Number of cameras detected: %d' % self.num_cameras, self.logname)

      for i, cam in enumerate(self.cam_list):

          self.cameras.append(cam)

          # Retrieve TL device nodemap and print device information
          self.nodemap_tldevice = self.cameras[i].GetTLDeviceNodeMap()
          self.log_device_info(self.nodemap_tldevice)

          self.cameras[i].Init()
          # Retrieve GenICam nodemap
          self.nodemap = self.cameras[i].GetNodeMap()

          self.initSingleCamera(self.cameras[i], self.nodemap, self.nodemap_tldevice)

      applyai.log('in init', self.logname)
      self.interval = 0.0
      self.job = []
      for i, cam in enumerate(self.cam_list):
        self.job.append(Schedule(interval=timedelta(seconds=self.interval), execute=self.capture, id=i))
        self.job[-1].start()
        applyai.log('background task started interval = ' + str(self.interval) + ' seconds', self.logname)
      #applyai.engine.subscribe('Camera/trigger', self.trigger)


    def updateCriticalVariables(self, cfg):
      #self.cfg = cfg
      applyai.log('updating Critical Variables', self.logname)

    def init(self):
      '''Called when the engine starts'''
      applyai.log('Setting up CameraPlugin', self.logname)
      self.xResStream = int(self.getCfgVal('xResStream'))
      self.yResStream = int(self.getCfgVal('yResStream'))
      self.camID      = int(self.getCfgVal('cameraID'))

    def capture(self, id=0):

      #  Retrieve next received image
      #
      #  *** NOTES ***
      #  Capturing an image houses images on the camera buffer. Trying
      #  to capture an image that does not exist will hang the camera.
      #
      #  *** LATER ***
      #  Once an image from the buffer is saved and/or no longer
      #  needed, the image must be released in order to keep the
      #  buffer from filling up.
      image_result = self.cameras[id].GetNextImage()

      #  Ensure image completion
      #
      #  *** NOTES ***
      #  Images can easily be checked for completion. This should be
      #  done whenever a complete image is expected or required.
      #  Further, check image status for a little more insight into
      #  why an image is incomplete.
      if image_result.IsIncomplete():
          applyai.log('Image incomplete with image status %d ...' % image_result.GetImageStatus(), self.logname)

      else:

          #  Convert image to BGR
          #
          #  *** NOTES ***
          #  Images can be converted between pixel formats by using
          #  the appropriate enumeration value. Unlike the original
          #  image, the converted one does not need to be released as
          #  it does not affect the camera buffer.
          #
          #  When converting images, color processing algorithm is an
          #  optional parameter.
          if self.getCfgVal('mode') == 'Live':
              self.frame = image_result.Convert(PySpin.PixelFormat_BGR8, PySpin.HQ_LINEAR).GetNDArray()
          else:
              filename = '../projects/' + self.project + '/images/frame_000_00.png'
              if os.path.isfile(filename):
                self.frame = cv2.imread(filename)
              else:
                self.frame = np.zeros([250,1000,3])
                cv2.putText(self.frame, "no test images found in '../projects/" + self.project + "/images'", (50, 130), cv2.FONT_HERSHEY_SIMPLEX, 1.1, (0,0,255), 3)

          # frame = cv2.resize(applyaiPlugin._lastFrame[0],(int(self.xResStream),int(self.yResStream)))
          self.store.updateFrameIn(self.name, id, self.frame)
          self.store.updateFrameOut(self.name, id, self.frame)
          applyai.engine.publish('newframe', self.frame)

          #  Release image
          #
          #  *** NOTES ***
          #  Images retrieved directly from the camera (i.e. non-converted
          #  images) need to be released in order to keep from filling the
          #  buffer.
          image_result.Release()


    def initSingleCamera(self, cam, nodemap, nodemap_tldevice):

          # In order to access the node entries, they have to be casted to a pointer type (CEnumerationPtr here)
          node_acquisition_mode = PySpin.CEnumerationPtr(nodemap.GetNode('AcquisitionMode'))
          if not PySpin.IsAvailable(node_acquisition_mode) or not PySpin.IsWritable(node_acquisition_mode):
              applyai.log('Unable to set acquisition mode to continuous (enum retrieval). Aborting...', self.logname)
              return False

          # Retrieve entry node from enumeration node
          node_acquisition_mode_continuous = node_acquisition_mode.GetEntryByName('Continuous')
          if not PySpin.IsAvailable(node_acquisition_mode_continuous) or not PySpin.IsReadable(node_acquisition_mode_continuous):
              applyai.log('Unable to set acquisition mode to continuous (entry retrieval). Aborting...', self.logname)
              return False

          # Retrieve integer value from entry node
          acquisition_mode_continuous = node_acquisition_mode_continuous.GetValue()

          # Set integer value from entry node as new value of enumeration node
          node_acquisition_mode.SetIntValue(acquisition_mode_continuous)

          applyai.log('Acquisition mode set to continuous...', self.logname)

          #  Begin acquiring images
          #
          #  *** NOTES ***
          #  What happens when the camera begins acquiring images depends on the
          #  acquisition mode. Single frame captures only a single image, multi
          #  frame catures a set number of images, and continuous captures a
          #  continuous stream of images. Because the example calls for the
          #  retrieval of 10 images, continuous mode has been set.
          #
          #  *** LATER ***
          #  Image acquisition must be ended when no more images are needed.
          cam.BeginAcquisition()

          applyai.log('Acquiring images...', self.logname)

          #  Retrieve device serial number for filename
          #
          #  *** NOTES ***
          #  The device serial number is retrieved in order to keep cameras from
          #  overwriting one another. Grabbing image IDs could also accomplish
          #  this.
          device_serial_number = ''
          node_device_serial_number = PySpin.CStringPtr(nodemap_tldevice.GetNode('DeviceSerialNumber'))
          if PySpin.IsAvailable(node_device_serial_number) and PySpin.IsReadable(node_device_serial_number):
              device_serial_number = node_device_serial_number.GetValue()
              applyai.log('Device serial number retrieved as %s...' % device_serial_number, self.logname)


    def start(self, params):
      params['targets'] = pd.DataFrame(columns=['plugin'])
      params['frameIn'] = self.frame
      params['frameOut'] = self.frame
      self.store.updateParams(self.name, params)
      applyai.engine.publish(self.name + '/finished',params)


    def stop(self):

      for i, cam in enumerate(self.cam_list):
        self.job[i].stop()

      for i, cam in enumerate(self.cam_list):
        cam.EndAcquisition()
        # Deinitialize camera
        cam.DeInit()

      # Release reference to camera
      # NOTE: Unlike the C++ examples, we cannot rely on pointer objects being automatically
      # cleaned up when going out of scope.
      # The usage of del is preferred to assigning the variable to None.
      del cam
      del self.cameras

      # Clear camera list before releasing system
      self.cam_list.Clear()

      # Release system instance
      self.system.ReleaseInstance()

    def log_device_info(self, nodemap):
      """
      This function prints the device information of the camera from the transport
      layer; please see NodeMapInfo example for more in-depth comments on printing
      device information from the nodemap.

      :param nodemap: Transport layer device nodemap.
      :type nodemap: INodeMap
      :returns: True if successful, False otherwise.
      :rtype: bool
      """

      applyai.log('*** DEVICE INFORMATION ***', self.logname)

      try:
          result = True
          node_device_information = PySpin.CCategoryPtr(nodemap.GetNode('DeviceInformation'))

          if PySpin.IsAvailable(node_device_information) and PySpin.IsReadable(node_device_information):
              features = node_device_information.GetFeatures()
              for feature in features:
                  node_feature = PySpin.CValuePtr(feature)
                  applyai.log('%s: %s' % (node_feature.GetName(),
                                    node_feature.ToString() if PySpin.IsReadable(node_feature) else 'Node not readable'), self.logname)

          else:
              applyai.log('Device control information not available.', self.logname)

      except PySpin.SpinnakerException as ex:
          applyai.log('Error: %s' % ex, self.logname)
          return False

      return result


if __name__ == '__main__':
  pass