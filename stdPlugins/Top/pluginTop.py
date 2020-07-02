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

    def __init__(self, name='Top'):
      stdAPI.__init__(self, name)

    def find_nearest_white(self, img, target):
        nonzero = cv2.findNonZero(img)
        distances = np.sqrt((nonzero[:,:,0] - target[0]) ** 2 + (nonzero[:,:,1] - target[1]) ** 2)
        nearest_index = np.argmin(distances)
        return nonzero[nearest_index], np.sqrt((nonzero[nearest_index][0][0] - target[0]) ** 2 + (nonzero[nearest_index][0][1] - target[1]) ** 2)

    def main(self, params):

      targets = params['targets']
      frameIn  = self.store.fetchFrameIn(self.name, 0)
      frameOut = cv2.cvtColor(frameIn, cv2.COLOR_BGR2GRAY)

      # test for circle segments
      maxInlierDist = int(self.getCfgVal('maxInlierDist'))
      minIOPoints = int(self.getCfgVal('minIOPoints'))

      for idx,row in targets.iterrows():
        if row['plugin'] == 'Circles':

          cx = int(row['x'])
          cy = int(row['y'])
          radius = int(row['w']/2)

          # test inlier percentage:
          # sample the circle and check for distance to the next edge
          counter = 0
          inlier  = 0

          # loop over circle every 10 degress
          cvals = np.arange(0.0, 2*math.pi, math.pi/18)
          for t in cvals:
            counter+=1
            cX = radius*math.cos(t) + cx
            cY = radius*math.sin(t) + cy

            px, dist = self.find_nearest_white(frameIn,(cX,cY))
            if dist < maxInlierDist:
              inlier+=1
              cv2.circle(frameOut, (px[0][0],px[0][1]), 4, (0,255,0), 1)
            else:
              cv2.circle(frameOut, (px[0][0],px[0][1]), 4, (255,0,0), 1)
          
          pcPointsNearCircle = 100.0*inlier/counter
          applyai.log("%3d pc of a circle with radius %d detected" % (pcPointsNearCircle, radius), self.logname)

          # draw the outer circle
          if pcPointsNearCircle >= minIOPoints:
            cv2.circle(frameOut,(cx,cy),radius,(0,255,0),3)
            targets.at[idx,'plugin'] = self.name
          else:
            cv2.circle(frameOut,(cx,cy),radius,(0,0,255),3)
            targets.at[idx,'plugin'] = 'NOT_' + self.name

      #for index, row in targets.iterrows(): 
      #  applyai.log(str(row).replace('\n','|').replace('      ',''), self.logname)

      self.store.updateFrameOut(self.name, 0, frameOut)
      self.store.updateTargets(targets)
      return targets

  class PCode(stdPCode):
    
    def __init__(self, name='Top'):
      stdPCode.__init__(self, name)

