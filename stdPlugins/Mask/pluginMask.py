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
import cv2
import requests
import os

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='Mask'):
      stdAPI.__init__(self, name)

    def main(self, params):

      params['status'] = 0
      frameInSource  = self.getCfgVal('frameIn')
      frameInChannel = self.getCfgVal('channel')
      frameIn = self.store.fetchFrameOut(frameInSource, frameInChannel)
      frameOut = frameIn.copy()

      applyai.log('work start', self.logname)
      x1 = int(self.getCfgVal('topLeftX'))
      y1 = int(self.getCfgVal('topLeftY'))
      x2 = int(self.getCfgVal('btmRightX'))
      y2 = int(self.getCfgVal('btmRightY'))
      if x2 <= 0:
        x2 = frameIn.shape[1] + x2
      if y2 <= 0:
        y2 = frameIn.shape[0] + y2

      # create mask
      mask = np.full((frameIn.shape[0], frameIn.shape[1]), 0, dtype=np.uint8)  # mask is only 
      cv2.rectangle(mask, (int(x1), int(y1)), (int(x2), int(y2)), (255, 255, 255), -1)
      frameOut = cv2.bitwise_and(frameIn, frameIn, mask=mask)
      applyai.log('work end', self.logname)

      self.store.updateFrameOut(self.name, 0, frameOut)
      return params

  class PCode(stdPCode):
    
    def __init__(self, name='Mask'):
      stdPCode.__init__(self, name)
      pass

