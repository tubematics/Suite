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

    def __init__(self, name='IsolateThread'):
      stdAPI.__init__(self, name)

    def main(self, params):

      frameInSource  = self.getCfgVal('frameIn')
      frameInChannel = self.getCfgVal('channel')
      frameIn = self.store.fetchFrameOut(frameInSource, frameInChannel)
      frameOut = frameIn.copy()

      for idx in range(self.targets.length()):
        row = self.targets.read(idx)
        x = row['cx']
        y = row['cy']
        w = row['w']
        h = row['h']
        angle = row['angle']
        if w > 150:
          x0 = x + (h/2-w/3) * math.cos(angle) #*math.pi/180)
          y0 = y + (h/2-w/3) * math.sin(angle) #*math.pi/180)
          p1x = x0 + w/2 * math.cos((angle+math.pi/2)) #*math.pi/180)
          p2x = x0 - w/2 * math.cos((angle+math.pi/2)) #*math.pi/180)
          p1y = y0 + w/2 * math.sin((angle+math.pi/2)) #*math.pi/180)
          p2y = y0 - w/2 * math.sin((angle+math.pi/2)) #*math.pi/180)
          cv2.line(frameOut, (int(p1x),int(p1y)),(int(p2x),int(p2y)), (0,0,0), 5) # black
          x0 = x - (h/2-w/3) * math.cos(angle) #*math.pi/180)
          y0 = y - (h/2-w/3) * math.sin(angle) #*math.pi/180)
          p1x = x0 + w/2 * math.cos((angle+math.pi/2)) #*math.pi/180)
          p2x = x0 - w/2 * math.cos((angle+math.pi/2)) #*math.pi/180)
          p1y = y0 + w/2 * math.sin((angle+math.pi/2)) #*math.pi/180)
          p2y = y0 - w/2 * math.sin((angle+math.pi/2)) #*math.pi/180)
          cv2.line(frameOut, (int(p1x),int(p1y)),(int(p2x),int(p2y)), (0,0,0), 5) # black

      self.store.updateFrameOut(self.name, 0, frameOut)
      return params


  class PCode(stdPCode):
    
    def __init__(self, name='IsolateThread'):
      stdPCode.__init__(self, name)
