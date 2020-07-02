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

sys.path.insert(0,"../tools")
import cvbasics

from applyai_APIClass import stdAPI
from applyai_APIClass import stdPCode

cvb = cvbasics.cvbasics()

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='Ellipse'):
      stdAPI.__init__(self, name)

  class PCode(stdPCode):
    
    def __init__(self, name='Ellipse'):
      stdPCode.__init__(self, name)
      self.threshold = self.loadValue('threshold')

    def start(self, params):

      params['targets'] = self.main(params)
      applyai.engine.publish(self.name + '/finished',params)

    def main(self, params):

      targets  = params['targets']
      frameIn  = self.store.fetchFrameIn(self.name, 0)
      frameOut = cv2.cvtColor(frameIn, cv2.COLOR_GRAY2BGR)

      d = int(frameIn.shape[0]/100)
      for idx,row in targets.iterrows():
        if row['plugin'] == 'Top':
          x = int(row['cx']) - int(row['cr']) - d
          y = int(row['cy']) - int(row['cr']) - d
          h = int((row['cr']+d) * 2)
          w = h
          if x >= 0 and x < frameIn.shape[1]:
            if y >= 0 and y < frameIn.shape[0]:

              partial = frameIn[y:y+h, x:x+w]
              mask = np.full((w, h), 0, dtype=np.uint8)
              cv2.circle(mask,(int(w/2),int(h/2)),int(row['cr']-2*d),(255,255,255),d*6)
              try:
                partial = cv2.bitwise_and(partial,partial,mask = mask)

                contours,hierarchy = cv2.findContours(partial.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)  #cv2.findContours(image, mode, method
                cnt_union = contours[0]
                for i, cnt in enumerate(contours):
                  if i > 0:
                    cnt_union = np.concatenate((cnt_union, cnt), axis=0)

                (ex,ey),(MA,ma),angle = cv2.fitEllipse(cnt_union)
                ex += x
                ey += y
                cv2.ellipse(frameOut, ((ex,ey),(MA,ma),angle), (0,255,0), 3)
                x1 = ex - MA * math.cos(angle)/2
                y1 = ey - MA * math.sin(angle)/2
                x2 = ex + MA * math.cos(angle)/2
                y2 = ey + MA * math.sin(angle)/2
                cv2.line(frameOut, (int(x1), int(y1)), (int(x2), int(y2)), (255,255,255), 1)

                targets.at[idx,'ex'] = ex
                targets.at[idx,'ey'] = ey
                targets.at[idx,'MA'] = MA
                targets.at[idx,'ma'] = ma
                targets.at[idx,'angle'] = angle
                targets.at[idx,'plugin'] = self.name
              except:
                applyai.log("problem in ecllipse", self.logname)

      for index, row in targets.iterrows(): 
        applyai.log(str(row).replace('\n','|').replace('      ',''),self.logname)

      self.store.updateFrameOut(self.name, 0, frameOut)
      self.store.updateTargets(targets)
      return targets

