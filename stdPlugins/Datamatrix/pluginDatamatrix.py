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
import sys
import imutils
from pylibdmtx.pylibdmtx import decode

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='Datamatrix'):
      stdAPI.__init__(self, name)

    def main(self, params):

      params['status'] = 0
      frameInSource  = self.getCfgVal('frameIn')
      frameInChannel = self.getCfgVal('channel')
      frameIn = self.store.fetchFrameOut(frameInSource, frameInChannel)
      frameOut = frameIn.copy()

      self.targets.reset()

      img_gray = cv2.cvtColor(frameOut, cv2.COLOR_BGR2GRAY)

      self.plan = params['plan']
      #print(self.plan['roi'])
      for roi in self.plan['roi']:
        if roi['type'] == 'Match':
          wf = float(roi['w'])
          hf = float(roi['h'])
          xf = float(roi['x'])
          yf = float(roi['y'])
          xi = int(xf - wf/2)
          yi = int(yf - hf/2)
          wi = int(wf)
          hi = int(hf)
          #cv2.rectangle(frameOut, (xi, yi), (xi + wi, yi + hi), (0,0,255), 3)
          cropCode = img_gray[yi:yi+hi, xi:xi+wi]

          W = 200
          width, depth = cropCode.shape
          imgScale = 0.5 #W/width
          newX,newY = cropCode.shape[1]*imgScale, cropCode.shape[0]*imgScale
          newimg = cv2.resize(cropCode,(int(newX),int(newY)))

          # frameOut = cv2.imread('./stdPlugins/Datamatrix/download.png')
          what = decode(newimg)
          #msg = what[0].decode(encoding='UTF-8',errors='strict')

          if len(what) > 0:
            applyai.log(str(what[0]), self.logname)
            codes = self.isolateCodes(what[0])
            applyai.log(str(codes), self.logname)
            yy = yi + 80
            for c in codes[:-2]:
              if c.find('rect') >= 0 or c.find('_a') >= 0:
                break
              if c != '':
                cv2.putText(frameOut, c , (xi+400, yy), cv2.FONT_HERSHEY_SIMPLEX, 1, self.color('blue'), 2)
                yy += 40
                self.targets.add(self.name, roi['nickname'], {'class': roi['type'],'cx':xi,'cy':yi,'w':wi,'h':hi,'angle':0,'code':c})
          else:
            applyai.log('No DMC found', self.logname)

      self.store.updateFrameOut(self.name, 0, frameOut)
      return params

    def isolateCodes(self, dmc):
      dmc = str(dmc).replace("Decoded(data=b'","")
      dmc = dmc.replace(")>","")
      dmc = dmc.replace("[","")
      dmc = dmc.replace("]","")
      #print(dmc)
      tags = ["\\x1e", "\\x1d", "\\x1d","\\x1d","\\x1e","\\x04"]
      #dmc = dmc.replace("\\","@")
      for c in tags:
        #print(dmc)
        dmc = dmc.replace(c,'@')
      
      #print(dmc)
      if dmc.find('@') >= 0:
        dmc = dmc.split('@')
      else:
        dmc = dmc.split(' ')
      #print(dmc)
      return(dmc)

  class PCode(stdPCode):
    
    def __init__(self, name='Datamatrix'):
      stdPCode.__init__(self, name)
