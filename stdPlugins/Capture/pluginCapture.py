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
import sys
import cv2
import numpy as np
import math

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='Capture'):
      stdAPI.__init__(self, name)
      self.filename = ''
      self.frame = []
      self.streams = []
      for i in range(10):
        sourceStr = 'sourceId' + str(i)
        if sourceStr in self.cfg.getConfig(self.name):
          if self.getCfgVal(sourceStr) != '':
            self.streams.append(self.getCfgVal(sourceStr))

    def main(self, params):

      if self.cfg.getCfgVal(self.name,'mode') == 'Live':
        for idx, source in enumerate(self.streams):
          cams = cv2.VideoCapture(source)
          while cams.isOpened():
            applyai.log('Accessing camera stream ' + source, self.logname)
            applyai.log('plugin name ' + self.name, self.logname)
            applyai.log('idx ' + str(idx), self.logname)
            ret, img = cams.read()
            if ret:
              applyai.log('ret ' + str(ret) + '|image.shape ' + str(img.shape), self.logname)
              self.store.updateFrameIn(self.name, idx, img)
              self.store.updateFrameOut(self.name, idx, img)
              break
            else:
              img = self.create_blank(1000,500)
              applyai.log('ret ' + str(ret) + '|image.shape ' + str(img.shape), self.logname)
              cv2.putText(img, "no images found at :", (100, 200), cv2.FONT_HERSHEY_SIMPLEX, 1.1, (255,255,255), 3)
              cv2.putText(img, source                , (100, 300), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255,255,255), 3)
              self.store.updateFrameIn(self.name, idx, img)
              self.store.updateFrameOut(self.name, idx, img)
              applyai.log('ERROR camera stream not available', self.logname)
              break
          cams.release()
      else:
        filename = '../projects/' + self.project + '/images/frame_000_00.jpg'
        if self.filename != filename:
          self.filename = filename
          self.frame = cv2.imread(filename)
          self.store.updateFrameOut(self.name, 0, self.frame)
          applyai.log('in capture not live ' + str(self.frame.shape), self.logname)
        #frame = cv2.resize(self.frame,(int(self.xResStream),int(self.yResStream)))
        #applyai.engine.publish('newframe',0,self.frame)

      return params

    def create_blank(self, width, height, rgb_color=(0, 0, 0)):
      """Create new image(numpy array) filled with certain color in RGB"""
      # Create black blank image
      image = np.zeros((height, width, 3), np.uint8)

      # Since OpenCV uses BGR, convert the color first
      color = tuple(reversed(rgb_color))
      # Fill image with color
      image[:] = color

      return image

  class PCode(stdPCode):
    
    def __init__(self, name='Capture'):
      stdPCode.__init__(self, name)

