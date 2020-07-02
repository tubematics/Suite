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

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

import logging

cvb = cvbasics.cvbasics()

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='Model'):
      stdAPI.__init__(self, name)
      #tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.INFO)

      # get TF logger
      log = logging.getLogger('tensorflow')
      log.setLevel(logging.DEBUG)

      # create formatter and add it to the handlers
      formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

      # create file handler which logs even debug messages
      fh = logging.handlers.RotatingFileHandler('../projects/' + self.project + '/logs/tensorflow.log', 'a', 100000, 100)
      fh.setLevel(logging.DEBUG)
      fh.setFormatter(formatter)
      log.addHandler(fh)

      graphPb = '../common/frozen_models/frozen_' + self.getCfgVal('modelName') + '.pb'
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

      self.counter = 1

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

    def stop(self):
      self.session.close()
      self.monitor.stop()
      applyai.log('Stopping monitor and tf session', self.logname)

    def main(self, params):
      
      source = 'http://ga-eng.de:8501/v1/models/' + self.getCfgVal('modelName') + ':predict'

      frameInSource  = self.getCfgVal('frameIn')
      frameInChannel = self.getCfgVal('channel')
      frameIn = self.store.fetchFrameOut(frameInSource, frameInChannel).copy()
      frameOut = frameIn.copy()

      #print('in model')
      step   = 1
      cam    = 0
      roi    = {'x':0,  'y':0,  'w':100, 'h':100}
      refWin = 'webcamFrame'
      ref    = {'x':0,  'y':0,  'w':10, 'h':10}

      x = ref['x'] + int(roi['x'] * ref['w']/100)
      y = ref['y'] + int(roi['y'] * ref['h']/100)
      w = int(roi['w'] * ref['w']/100)
      h = int(roi['h'] * ref['h']/100)
      #print(x,y,w,h)
      x = 0
      y = 0
      w = frameIn.shape[1]
      h = frameIn.shape[0]

      partialFrame = frameIn[y:y+h, x:x+w]
      #cv2.rectangle(frameOut,(x,y),(x+w,y+h),(255,0,0),2)

      #dc, db, ds = tfServing.aiApiRequest(source, partialFrame)
      prediction = self.predict(partialFrame)
      db = prediction[0][0]
      ds = prediction[1][0]
      dc = prediction[2][0]

      for i in range(int(self.getCfgVal('maxDetections'))):
        applyai.log(("%01d %3.0f pc" % ((i+1), ds[i]*100)) + ' | ' + ("%d" % (dc[i])) + " | " + self.getCfgVal('modelName'), self.logname)
        if ds[i] > float(self.getCfgVal('modelScoreLimit')):

          w,h,c = partialFrame.shape
          y1 = y + int(db[i][0] * w)
          x1 = x + int(db[i][1] * h)
          y2 = y + int(db[i][2] * w)
          x2 = x + int(db[i][3] * h)
          cx = int((x1+x2)/2)
          cy = int((y1+y2)/2)

          cv2.rectangle(frameOut,(x1,y1),(x2,y2),cvb.colBlue,2)
          cv2.putText(frameOut, "#" + str(i) + '_' + str(int(dc[i])), (cx-30, cy+20), cv2.FONT_HERSHEY_SIMPLEX, 1.5, cvb.colRed, 5)

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

          if self.targets.length() > 0:
            found = False
            for index in range(self.targets.length()):
              row = self.targets.read(index)
              if (row['cx'] < limXp) & (row['cx'] > limXm) & (row['cy'] < limYp) & (row['cy'] > limYm):
                found = True #print('duplicate found')
                break
            if not found:
              self.targets.add(self.name, i, {'class': dc[i], 'cx':int(cx),'cy':int(cy),'w':int(x2-x1),'h':int(y2-y1),'dim': ds[i], 'angle':0, 'area':0})
          else:
            # this is the first in the list as targets length = 0
            self.targets.add(self.name, i, {'class': dc[i], 'cx':int(cx),'cy':int(cy),'w':int(x2-x1),'h':int(y2-y1),'dim': ds[i], 'angle':0, 'area':0})

        else:
          pass

      #cv2.imwrite('../common/images/h&f/gifme_' + str(self.counter) + '.jpg', frameOut)
      self.counter += 1

      for index in range(self.targets.length()):
        row = self.targets.read(index)
        applyai.log(str(row).replace('\n','|').replace('      ',''),self.logname)

      self.store.updateFrameOut(self.name, 0, frameOut)
      return params

  class PCode(stdPCode):
    
    def __init__(self, name='Model'):
      stdPCode.__init__(self, name)
