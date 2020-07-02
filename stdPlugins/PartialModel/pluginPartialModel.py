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
import numpy as np

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

import tensorflow as tf
import cv2

import sys
sys.path.insert(0,"../tools")
import tfServing
import cvbasics

from applyai_APIClass import stdAPI
from applyai_APIClass import stdPCode

import logging

cvb = cvbasics.cvbasics()

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='PartialModel'):
      stdAPI.__init__(self, name)

  class PCode(stdPCode):
    
    def __init__(self, name='PartialModel'):
      stdPCode.__init__(self, name)
      #tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.INFO)

      # get TF logger
      log = logging.getLogger('tensorflow')
      log.setLevel(logging.DEBUG)

      # create formatter and add it to the handlers
      formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

      # create file handler which logs even debug messages
      fh = logging.handlers.RotatingFileHandler('../common/logs/tensorflow.log', 'a', 100000, 100)
      fh.setLevel(logging.DEBUG)
      fh.setFormatter(formatter)
      log.addHandler(fh)

      # setup the config file
      self.exportConfigVariable(0, 'text',   'description',  0, '', '', 'The Model plugin takes a color image and uses inference to detect objects of interest. The model used is defined by the "model name" and can be found in the ../common/frozen_models directory. The model plugin can use inference locally or via a TFX server such as https://aiModelHub.com). Detected objects can be identified in the frameOut image and are numbered for identification. The number corresponds to the number used in the targets dataframe.')
      self.exportConfigVariable(0, 'text',   'input',        0, '', '', 'Color image, dataframe targets')
      self.exportConfigVariable(0, 'text',   'output',       0, '', '', 'Color image modified, dataframe targets returned with list of objects')
      self.exportConfigVariable(1, 'text',   'modelName','Washer', '', 'Model name', 'Frozen model name')
      self.exportConfigVariable(1, 'number', 'modelScoreLimit',0.9, '', 'Minimum score', 'minimum score for detection')
      self.exportConfigVariable(1, 'number', 'maxDetections',10, '', 'Max detections', 'Maximum number of detections before stopping inference')
      self.exportConfigVariable(1, 'number', 'infSource',    0, '', 'Inference resourse', '', '0~Default@0~Jetson GPU@1~TFX Server')
      self.exportConfigVariable(1, 'url',    'modelServer', 'http://ga-eng.de:8501', '', 'TFX server', 'url of the tfx server for model inference')
      self.cfg = self.updateConfig()
      self.saveConfig()

      graphPb = '../common/frozen_models/frozen_' + self.cfg['modelName']['value'] + '.pb'
      applyai.log("loading frozen graph " + graphPb + " ...", self.logname)
      self.graph = self.load_graph(graphPb)
      applyai.log("loaded frozen graph", self.logname)
      applyai.log("starting tf session ...", self.logname)
      self.session = tf.compat.v1.Session(graph=self.graph)
      applyai.log("started tf session", self.logname)
      
      self.inputTensor  = self.graph.get_tensor_by_name('prefix/image_tensor:0')
      self.y1 = self.graph.get_tensor_by_name('prefix/num_detections:0')
      self.y2 = self.graph.get_tensor_by_name('prefix/detection_boxes:0')
      self.y3 = self.graph.get_tensor_by_name('prefix/detection_scores:0')
      self.y4 = self.graph.get_tensor_by_name('prefix/detection_classes:0')

    def load_graph(self, frozen_graph_filename):
      # We load the protobuf file from the disk and parse it to retrieve the 
      # unserialized graph_def
      with tf.io.gfile.GFile(frozen_graph_filename, "rb") as f:
          graph_def = tf.compat.v1.GraphDef()
          graph_def.ParseFromString(f.read())

      # Then, we import the graph_def into a new Graph and returns it 
      with tf.Graph().as_default() as graph:
          # The name var will prefix every op/nodes in your graph
          # Since we load everything in a new graph, this is not needed
          tf.import_graph_def(graph_def, name="prefix")
      return graph
      
    def predict(self, image):
      data = np.expand_dims(image, 0)
      applyai.log("starting tf session run", self.logname)
      ret = self.session.run([self.y2, self.y3, self.y4], feed_dict={self.inputTensor: data})
      applyai.log("tf session run completed", self.logname)
      return ret

    def start(self, params):

      source = 'http://ga-eng.de:8501/v1/models/' + self.cfg['modelName']['value'] + ':predict'
      params['targets'] = self.inference(params, source)
      applyai.engine.publish(self.name + '/finished', params)

    def stop(self):
      self.session.close()
      self.monitor.stop()
      applyai.log('Stopping monitor and tf session', self.logname)

    def inference(self, params, source):
      
      targets = params['targets']
      frameIn = self.store.fetchFrameIn(self.name, 0)
      frameOut = frameIn.copy()

      roi    = {'x':0,  'y':0,  'w':100, 'h':100}
      refWin = 'webcamFrame'
      ref    = {'x':0,  'y':0,  'w':10, 'h':10}

      x = ref['x'] + int(roi['x'] * ref['w']/100)
      y = ref['y'] + int(roi['y'] * ref['h']/100)
      w = int(roi['w'] * ref['w']/100)
      h = int(roi['h'] * ref['h']/100)

      for idx,row in targets.iterrows():
        if row['plugin'] == 'Model':

          w = int(row['w']*1.2)
          h = int(row['h']*1.2)
          if w < 300:
            w = 300
          if h < 300:
            h = 300
          w = 400
          h = 400
          x = int(row['mx']-w/2)
          y = int(row['my']-h/2)
          if x < 0:
            x = 0
          if y < 0:
            y = 0
          if x+w > frameIn.shape[1]:
            w = frameIn.shape[1]-x
          if y+h > frameIn.shape[0]:
            h = frameIn.shape[0]-y

          partialFrame = frameIn[y:y+h, x:x+w]
          cv2.rectangle(frameOut,(x,y),(x+w,y+h),(255,0,0),2)

          cv2.imwrite('../common/images/h&f/gifme_' + str(idx) + '.jpg', partialFrame)

          prediction = self.predict(partialFrame)
          db = prediction[0][0]
          ds = prediction[1][0]
          dc = prediction[2][0]

          for i in range(int(self.cfg['maxDetections']['value'])):
            applyai.log(("%01d %3.0f pc" % ((i+1), ds[i]*100)) + ' | ' + ("%d" % (dc[i])) + " | " + self.cfg['modelName']['value'], self.logname)
            if ds[i] > float(self.cfg['modelScoreLimit']['value']):

              w,h,c = partialFrame.shape
              y1 = y + int(db[i][0] * w)
              x1 = x + int(db[i][1] * h)
              y2 = y + int(db[i][2] * w)
              x2 = x + int(db[i][3] * h)
              cx = int((x1+x2)/2)
              cy = int((y1+y2)/2)

              cv2.rectangle(frameOut,(x1,y1),(x2,y2),cvb.colGreen,3)
              #cv2.putText(frameOut, "#" + str(i) + '_' + str(int(dc[i])), (cx-30, cy+20), cv2.FONT_HERSHEY_SIMPLEX, 1.5, cvb.colRed, 5)

              cx = (x1+x2)/2
              cy = (y1+y2)/2
              radius = ((x2-x1)+(y2-y1))/2
              area = (x2-x1)*(y2-y1)
              solidity = 1
              angle = 0

              delta = 40
              limXp = cx + delta
              limXm = cx - delta
              limYp = cy + delta
              limYm = cy - delta

              if targets.shape[0] > 0:
                c = targets.loc[(targets['mx'] < limXp) & (targets['mx'] > limXm) & (targets['my'] < limYp) & (targets['my'] > limYm)]
                if c.shape[0] == 0:

                  targets = targets.append(
                        {'mx':int(cx),'my':int(cy),'score': ds[i], 'class': dc[i], 'plugin': self.name},
                        ignore_index=True)
              else:
                targets = targets.append(
                    {'mx':int(cx),'my':int(cy),'score': ds[i], 'class': dc[i], 'plugin': self.name},
                    ignore_index=True)

            else:
              pass

      for index, row in targets.iterrows(): 
        applyai.log(str(row).replace('\n','|').replace('      ',''),self.logname)

      self.store.updateFrameOut(self.name, 0, frameOut)
      self.store.updateTargets(targets)
      return targets

