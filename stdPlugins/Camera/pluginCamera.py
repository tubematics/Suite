# =============================================================================
# Copyright (c) 2018-2019 gardner ag. All Rights Reserved.
#
# This software is the confidential and proprietary information of gardner ag
# ("Confidential Information"). You shall not disclose such 
# Confidential Information and shall use it only in
# accordance with the terms of the license agreement you entered into
# with gardner ag.
#
# GARDNER AG MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE SUITABILITY OF THE
# SOFTWARE, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
# PURPOSE, OR NON-INFRINGEMENT. GARDNER AG SHALL NOT BE LIABLE FOR ANY DAMAGES
# SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR DISTRIBUTING
# THIS SOFTWARE OR ITS DERIVATIVES.
# =============================================================================
import cherrypy as applyai
import time, signal
from datetime import timedelta
import cv2
import numpy as np
from applyai_vision.scheduler import Schedule
import datetime

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

class applyaiPlugin:

  class API(stdAPI):

    #_tp = template.template()
    _streaming = True
    _lastFrame = np.full((2), None)
    _lastTimeUpdate = np.full((2), datetime.datetime.now())

    def __init__(self, name='Camera'):
      stdAPI.__init__(self, name)
      applyai.log('in init CameraFeed','CAMERA')
      applyai.engine.subscribe('newframe', self.updateFrame)

    def updateFrame(self, cam, frame):
      if cam >= 0 and cam < 2:
        applyaiPlugin.API._lastFrame[cam] = frame
        jetzt = datetime.datetime.now()
        delta = jetzt - applyaiPlugin.API._lastTimeUpdate[cam]
        #applyai.log('in updateFrame ' + str(delta.total_seconds()), 'CAMERA')
        applyaiPlugin.API._lastTimeUpdate[cam] = datetime.datetime.now()

    def genReturn(self, cam=0):
      cam = int(cam)
      """Video streaming generator function."""
      #while CameraFeed._streaming:
      if cam >= 0 and cam < 2:
        frame = applyaiPlugin.API._lastFrame[cam] # camera.get_frame()
        img = cv2.imencode('.jpg', frame)[1].tobytes()
        return (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + img + b'\r\n')

    @applyai.expose
    def feed(self, camera=0):
      img = self.genReturn(camera) #cameraFeed.cam)
      applyai.response.headers['Content-Type']= 'multipart/x-mixed-replace; boundary=frame'
      return img

    def genYield(self, cam=0):
      cam = int(cam)
      """Video streaming generator function."""
      while applyaiPlugin.API._streaming:
        if cam >= 0 and cam < 2:
          frame = applyaiPlugin.API._lastFrame[cam] # camera.get_frame()
          img = cv2.imencode('.jpg', frame)[1].tobytes()
          yield (b'--frame\r\n'
                  b'Content-Type: image/jpeg\r\n\r\n' + img + b'\r\n')

    @applyai.expose
    def stream(self, camera=0):
      img = self.genYield(camera) #cameraFeed.cam)
      applyai.response.headers['Content-Type']= 'multipart/x-mixed-replace; boundary=frame'
      return img

    stream._cp_config = {'response.stream': True}


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

    def main(self, params):

      params['status'] = 0
      channel = 0 #params['channel']
      frame = applyaiPlugin.API._lastFrame[channel]
      self.store.updateFrameIn(self.name, 0, frame)
      self.store.updateFrameOut(self.name, 0, frame)
      #applyai.log('in main Camera', self.logname)
      return params

  class PCode(stdPCode):
    
    #_sleep = None

    def __init__(self, name='Camera'):
      stdPCode.__init__(self, name)
      self.maxCameras = 10
      self.init()
      applyai.engine.subscribe(self.name + '/monitorConfig', self.updateCriticalVariables)

    def updateCriticalVariables(self, cfg):
      #self.cfg = cfg
      self.exposure   = int(self.getCfgVal('exposure'))
      self.focus      = int(self.getCfgVal('focus'))
      applyai.log('updating Critical Variables', self.logname)

    def init(self):
      '''Called when the engine starts'''
      applyai.log('Setting up CameraPlugin', self.logname)

      # You can listen for a message published in request handler or
      # elsewhere. Usually it's putting some into the queue and waiting 
      # for queue entry in the thread.

      self.xResStream = self.getCfgVal('xResStream')
      self.yResStream = self.getCfgVal('yResStream')
      self.camID      = self.getCfgVal('cameraID')
      self.exposure   = int(self.getCfgVal('exposure'))
      self.focus      = int(self.getCfgVal('focus'))
      self.xRes       = self.getCfgVal('xRes')
      self.yRes       = self.getCfgVal('yRes')
      if self.camID >= 0 and self.camID < self.maxCameras:
        self.cam = cv2.VideoCapture(self.camID)
        fourcc = cv2.VideoWriter_fourcc('M','J','P','G')
        self.cam.set(cv2.CAP_PROP_FOURCC, fourcc)
        self.cam.set(cv2.CAP_PROP_FRAME_WIDTH, int(self.xRes))
        self.cam.set(cv2.CAP_PROP_FRAME_HEIGHT, int(self.yRes))
        #if self.exposure > 0:
        #  self.cam.set(cv2.CAP_PROP_AUTO_EXPOSURE, 1)
        #if self.focus > 0:
        #  try:
        #    self.cam.set(cv2.CAP_PROP_AUTOFOCUS, 0)
        #  except Exception as e:
        #    # applyai.log(e, self.logname)
        #    pass

      self.interval = 0.0250
      self.job = Schedule(interval=timedelta(seconds=self.interval), execute=self.capture)
      self.job.start()
      applyai.log('background task started interval = ' + str(self.interval) + ' seconds',self.logname)
      applyai.engine.subscribe('Camera/trigger', self.trigger)

    # Make sure plugin priority matches your design e.g. when starting a
    # thread and using Daemonizer which forks and has priority of 65, you
    # need to start after the fork as default priority is 50
    # see https://groups.google.com/forum/#!topic/applyai-users/1fmDXaeCrsA
    #start.priority = 70 

    def stop(self):
      applyai.log('stopping plugin', self.logname)
      try:
        self.cam.release()
        self.job.stop()
      except:
        pass
      #applyai.engine.unsubscribe('Camera/trigger', self.trigger)
      applyai.engine.subscribe('Camera/monitorConfig', self.updateCriticalVariables)

    def exit(self):
      '''Called when the engine exits'''
      applyai.log('exiting plugin', self.logname)
      self.unsubscribe()

    def capture(self):
      if self.cfg.getCfgVal(self.name,'mode') == 'Live':
        try:
          self.exposure   = int(self.cfg.getCfgVal(self.name,'exposure'))
          self.focus      = int(self.cfg.getCfgVal(self.name,'focus'))
          if self.cfg['type']['value'] == 'C920' and self.exposure > 0:
            self.cam.set(cv2.CAP_PROP_EXPOSURE, self.exposure)
          #if self.cfg['type']['value'] == 'Brio' and self.exposure > 0:
          #  self.cam.set(cv2.CAP_PROP_EXPOSURE, self.exposure)
          #  self.cam.set(cv2.CAP_PROP_FOCUS, self.focus)
        except Exception as e:
          pass
        #applyai.log(e, self.logname)
        if self.cam.isOpened():
          ret, self.frame = self.cam.read()
          #applyai.log('in capture routine ' + str(self.frame.shape) + ' ret:' + str(ret), self.logname)
          if ret:
            frame = cv2.resize(self.frame,(int(self.xResStream),int(self.yResStream)))
            applyai.engine.publish('newframe',self.camID,frame)
      else:
        try:
          #self.job.stop()
          filename = '../projects/' + self.project + '/images/frame_000_00.jpg'
          self.frame = cv2.imread(filename)
          #applyai.log('in capture not live ' + str(self.frame.shape), self.logname)
          frame = cv2.resize(self.frame,(int(self.xResStream),int(self.yResStream)))
          applyai.engine.publish('newframe',self.camID,frame)
        except:
          applyai.log('Error in capture routine mode!=Live ' + filename, self.logname)

    def trigger(self, cam):
      applyai.log('Camera/trigger: {0}'.format(cam), self.logname)
      cam = int(cam)
      if cam >= 0 and cam < self.maxCameras:
        # wite the current frame to disk
        fname = str('../projects/%s/images/frame_000_%02d.jpg' % (self.project, cam))
        cv2.imwrite(fname, self.frame)



