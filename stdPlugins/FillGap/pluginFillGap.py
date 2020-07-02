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
import math
from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='FillGap'):
      stdAPI.__init__(self, name)
      applyai.log('in init',self.logname)

    def main(self, params):

      frameIn = self.store.fetchFrameIn(self.name, 0)
      frameOut = frameIn.copy()

      gray = cv2.cvtColor(frameIn,cv2.COLOR_BGR2GRAY)
      ret, thresh = cv2.threshold(gray,0,255,cv2.THRESH_BINARY)

      sizeOfKernel   = int(self.getCfgVal('sizeOfKernel'))
      noOfIterations = int(self.getCfgVal('noOfIterations'))

      # noise removal
      kernel = np.ones((sizeOfKernel,sizeOfKernel),np.uint8)
      closing = cv2.morphologyEx(thresh,cv2.MORPH_CLOSE,kernel, iterations = 2)

      # sure background area
      sure_fg = cv2.dilate(closing,kernel,iterations=noOfIterations)

      maxGap = int(self.getCfgVal('maxGap'))
      maxContours = int(self.getCfgVal('maxContours'))

      contours, hierarchy = cv2.findContours(sure_fg,cv2.RETR_LIST,cv2.CHAIN_APPROX_SIMPLE)[-2:]
      cc = 0
      for c in contours:
        area = cv2.contourArea(c)
        if area > 5:
          cv2.drawContours(frameOut, [c], -1, (255, 255, 255),1)
          ext = []
          #kx = contours[c][:,0,0]
          #ky = contours[c][:,0,1]
          ext.append(tuple(c[c[:, :, 0].argmin()][0]))
          ext.append(tuple(c[c[:, :, 0].argmax()][0]))
          ext.append(tuple(c[c[:, :, 1].argmin()][0]))
          ext.append(tuple(c[c[:, :, 1].argmax()][0]))
          #print(extLeft)
          #cv2.circle(frameOut, ext[0],   4, (0, 0, 255), -1)
          #cv2.circle(frameOut, ext[1],   4, (0, 0, 255), -1)
          #cv2.circle(frameOut, ext[2],   4, (0, 0, 255), -1)
          #cv2.circle(frameOut, ext[3],   4, (0, 0, 255), -1)
          for a in contours:
            _ext = []
            _ext.append(tuple(a[a[:, :, 0].argmin()][0]))
            _ext.append(tuple(a[a[:, :, 0].argmax()][0]))
            _ext.append(tuple(a[a[:, :, 1].argmin()][0]))
            _ext.append(tuple(a[a[:, :, 1].argmax()][0]))
            _min_d = 99999
            _min_e = (0,0)
            _min_a = (0,0)
            for e in ext:
              for _e in _ext:
                d = math.sqrt((e[0]-_e[0])**2+(e[1]-_e[1])**2)
                if d < _min_d:
                  _min_d = d
                  _min_e = e
                  _min_a = _e
            
            if _min_d < maxGap:
              cv2.line(frameOut, _min_e, _min_a,(255,255,255),3)
        cc += 1
        if cc > maxContours:
          applyai.log("$Error: max contours (" + str(maxContours) + ") exceeded - breaking off analysis", self.logname)
          break

      self.store.updateFrameOut(self.name, 0, frameOut)
      return params

      
  class PCode(stdPCode):
    
    def __init__(self, name='FillGap'):
      stdPCode.__init__(self, name)
