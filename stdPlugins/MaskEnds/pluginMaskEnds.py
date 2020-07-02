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
import math

import os
import cv2

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='MaskEnds'):
      stdAPI.__init__(self, name)

    def main(self, params):

      targets = params['targets']
      frameIn = self.store.fetchFrameIn(self.name, 0)
      frameOut = frameIn.copy()

      #find the backbone of the parts by masking the ends of the parts
      for idx, row in targets.iterrows():
        x = row['x']
        y = row['y']
        w = row['w']
        h = row['h']
        angle = row['angle']
        x0 = x + (h/2-w/3) * math.cos(angle)
        y0 = y + (h/2-w/3) * math.sin(angle)
        cv2.circle(frameOut, (int(x0),int(y0)), int(w*0.8), (0, 0, 0), -1)
        x0 = x - (h/2-w/3) * math.cos(angle)
        y0 = y - (h/2-w/3) * math.sin(angle)
        cv2.circle(frameOut, (int(x0),int(y0)), int(w*0.8), (0, 0, 0), -1)

      self.store.updateFrameIn(self.name, 0, frameIn)
      self.store.updateFrameOut(self.name, 0, frameOut)
      self.store.updateTargets(targets)
      self.store.updateTargets(targets)
      return targets


  class PCode(stdPCode):
    
    def __init__(self, name='MaskEnds'):
      stdPCode.__init__(self, name)
