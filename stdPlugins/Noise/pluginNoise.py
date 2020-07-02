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
import imutils

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='Noise'):
      stdAPI.__init__(self, name)

    def main(self, params):

      params['status'] = 0
      frameInSource  = self.getCfgVal('frameIn')
      frameInChannel = self.getCfgVal('channel')
      frameIn = self.store.fetchFrameOut(frameInSource, frameInChannel)
      #frameOut = frameIn.copy() # not required as it is overwritten later
      
      threshold = int(self.getCfgVal('threshold'))
      minArea = int(self.getCfgVal('minArea'))

      #mode = self.cfg.getCfgVal('Project','runningMode')

      gray = cv2.cvtColor(frameIn, cv2.COLOR_BGR2GRAY)
      _, binary = cv2.threshold(gray, threshold, 255, cv2.THRESH_BINARY)
      cnts = cv2.findContours(binary, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
      cnts = imutils.grab_contours(cnts)
      mask = np.ones(frameIn.shape[:2], dtype="uint8") * 255
  
      # loop over the contours
      for c in cnts:
        area = cv2.contourArea(c)
        #print(area)
        if area < minArea:
          cv2.drawContours(mask, [c], -1, 0, -1)
          
      frameOut = cv2.bitwise_and(binary, binary, mask=mask)
      frameOut = cv2.cvtColor(frameOut, cv2.COLOR_GRAY2BGR)
      self.store.updateFrameOut(self.name, 0, frameOut)
      return params

  class PCode(stdPCode):
    
    def __init__(self, name='Noise'):
      stdPCode.__init__(self, name)

