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

    def __init__(self, name='GripPos'):
      stdAPI.__init__(self, name)

    def main(self, params):

      targets = params['targets']
      frameIn = self.store.fetchFrameIn(self.name, 0)
      frameOut = self.store.fetchFrameOut('Mask', 0).copy()

      gray = cv2.cvtColor(frameIn, cv2.COLOR_BGR2GRAY)
      contours, hierarchy = cv2.findContours(gray,cv2.RETR_LIST,cv2.CHAIN_APPROX_SIMPLE)[-2:]

      if not targets.empty:
        targets.insert(1, "ry", 0)
        targets.insert(1, "rx", 0)

        # find corresponding targets from previos plugin
        maxDist  = 100
        for idx, row in targets.iterrows():
          if row['class'] > 0:
            #print('found row')
            for cnt in contours:
              area = cv2.contourArea(cnt)
              if area > 500 and area < 6000:
                #print('found contour ' + str(area))
                rect = cv2.minAreaRect(cnt)
                center, size, angle = rect
                x = row['x']
                y = row['y']
                dx = center[0] - x
                dy = center[1] - y
                if math.fabs(dx) < maxDist and math.fabs(dy) < maxDist:
                  #applyai.log('found type %d %d %d %d %d %d' % (row['class'], area, max(size), min(size),dx,dy), self.logname)

                  a = 180/math.pi*(row['angle']+math.pi/2)
                  c = (x,y)
                  s = (row['w'],row['h'])
                  box = cv2.boxPoints((c,s,a))
                  box = np.int0(box)
                  targets.at[idx,'rx'] = center[0]
                  targets.at[idx,'ry'] = center[1]

                  cv2.circle(frameOut, (int(center[0]), int(center[1])), 20, self.color('red'), 3)
                  cv2.circle(frameOut, (int(center[0]), int(center[1])), 10, self.color('red'), 3)

      self.store.updateFrameOut(self.name, 0, frameOut)
      self.store.updateTargets(targets)
      return targets


  class PCode(stdPCode):
    
    def __init__(self, name='GripPos'):
      stdPCode.__init__(self, name)
