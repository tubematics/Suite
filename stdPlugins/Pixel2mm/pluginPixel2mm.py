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

    def __init__(self, name='Pixel2mm'):
      stdAPI.__init__(self, name)

    def main(self, params):

      targets = params['targets']
      frameIn = self.store.fetchFrameIn(self.name, 0)
      frameOut = self.store.fetchFrameOut('Mask', 0).copy()

      # new targets dataframe
      gripTargets = pd.DataFrame(columns=['plugin'])

      if not targets.empty:
        targets.insert(1, "c", 0)
        targets.insert(1, "b", 0)
        targets.insert(1, "a", 0)
        targets.insert(1, "zmm", 0)
        targets.insert(1, "ymm", 0)
        targets.insert(1, "xmm", 0)

        # scale x and y to mm
        # add the angles a,b,c
        offsetMM = {'x':0,'y':150,'z':125}
        scaleMM  = {'x':300/2048,'y':300/2048}

        targets['plugin'] = self.name

        for idx, row in targets.iterrows():

            targets.at[idx,'xmm'] = offsetMM['x'] + row['rx'] * scaleMM['x']
            targets.at[idx,'ymm'] = offsetMM['y'] + row['ry'] * scaleMM['y']
            targets.at[idx,'zmm'] = offsetMM['z']
            targets.at[idx,'c'] = row['angle']
            if row['class'] == 1:
              targets.at[idx,'a'] = 90
            if row['class'] == 2:
              targets.at[idx,'a'] = 210
            if row['class'] == 3:
              targets.at[idx,'a'] = 0

            cv2.circle(frameOut, (int(row['rx']), int(row['ry'])), 20, (0,255,255), 3)
            cv2.circle(frameOut, (int(row['rx']), int(row['ry'])), 10, (0,255,255), 3)

      #print(targets)
      self.store.updateFrameOut(self.name, 0, frameOut)
      self.store.updateTargets(targets)
      return targets


  class PCode(stdPCode):
    
    def __init__(self, name='Pixel2mm'):
      stdPCode.__init__(self, name)
