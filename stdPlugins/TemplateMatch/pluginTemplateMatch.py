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
import os
import time
import math

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='TemplateMatch'):
      stdAPI.__init__(self, name)

    def main(self, params):

      params['status'] = 0
      frameInSource  = self.getCfgVal('frameIn')
      frameInChannel = self.getCfgVal('channel')
      frameIn = self.store.fetchFrameOut(frameInSource, frameInChannel).copy()
      frameOut = frameIn.copy()
      overlay = frameOut.copy()

      img_gray = cv2.cvtColor(frameOut, cv2.COLOR_BGR2GRAY)

      threshold = float(self.getCfgVal('tmThreshold'))
      n = int(self.getCfgVal('tmNoOfOkExpected'))

      self.plan = params['plan']
      #print(self.plan['roi'])
      for roi in self.plan['roi']:
        if roi['type'] == 3: #'Match':
          x = int(roi['x'])
          y = int(roi['y'])
          w = int(roi['w'])
          h = int(roi['h'])
          a = int(roi['angle'])
          box = cv2.boxPoints(((x,y),(w,h),a))
          #print(box)
          mi = np.amin(box, axis=0)
          ma = np.amax(box, axis=0)
          xi = int(mi[0])
          yi = int(mi[1])
          wi = int(ma[0])-xi
          hi = int(ma[1])-yi
          #cv2.rectangle(frameOut, (xi, yi), (xi + wi, yi + hi), (0,0,255), 3)
          img_roi = img_gray[yi:yi+hi, xi:xi+wi]

          # TODO Speed improvement potential - read in at start once - keep all ref images in memory
          part = params['order']['part']
          name = roi['nickname'].split('_')
          roiRef = name[0] + '_' + str(int(name[1]) + 1)
          ref = '../projects/' + self.project + '/parts/MatchRef~' + part + '~' + roiRef + '.1.jpg'
          applyai.log(ref, self.logname)
          template = cv2.imread(ref,0)
          if hasattr(template, 'shape'):
            w, h = template.shape[::-1]
            cols = ['red', 'lime']
            res = cv2.matchTemplate(img_roi, template, cv2.TM_CCOEFF_NORMED)

            #print(len(res))
            #for i in range(len(res)):
            #  for j in range(len(res[i])):
            #    print(res[i][j])
            #cv2.normalize( res, res, 0, 1, cv2.NORM_MINMAX, -1 )
            #_minVal, _maxVal, minLoc, maxLoc = cv2.minMaxLoc(res, None)
            #print(_minVal, _maxVal, minLoc, maxLoc)

            for phase in range(2):
              if phase == 0:
                loc = np.where(np.logical_and(np.greater(res,threshold - 0.1),np.less(res,threshold)))
              else:
                loc = np.where(res > threshold)
              
              cc=1
              for pt in zip(*loc[::-1]):
                #print(len(pt))
                x1 = pt[0] + xi
                y1 = pt[1] + yi
                x2 = pt[0] + xi + w
                y2 = pt[1] + yi + h
                cv2.rectangle(overlay, (x1,y1),(x2,y2), self.color(cols[phase]), -1)
                id = roi['nickname'] + '.' + str(cc)
                found = False
                delta = 10
                for index in range(self.targets.length()):
                  row = self.targets.read(index)
                  if (self.name == row['plugin'] and
                    math.fabs((x1+x2)/2 - row['cx']) < delta and
                    math.fabs((y1+y2)/2 - row['cy']) < delta):
                    found = True
                    break
                if not found:
                  self.targets.add(self.name, id, {'type': 'Match', 'cx':(x1 + x2) / 2, 'cy':(y1 + y2) / 2, 'w':(x2 - x1), 'h': y2 - y1, 'angle': 0, 'dim': 1})
                cc+=1
          else:
            applyai.log('$Error - file expected: ' + ref, self.logname)

      alpha = 0.3
      frameOut = cv2.addWeighted(overlay, alpha, frameOut, 1 - alpha, 0)
      self.store.updateFrameOut(self.name, 0, frameOut)
      return params

  class PCode(stdPCode):
    
    def __init__(self, name='TemplateMask'):
      stdPCode.__init__(self, name)
      pass

if __name__ == "__main__":
  pass