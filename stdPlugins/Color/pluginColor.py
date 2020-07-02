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

    def __init__(self, name='Color'):
      stdAPI.__init__(self, name)

    def main(self, params):

      frameInSource  = self.getCfgVal('frameIn')
      frameInChannel = self.getCfgVal('channel')
      frameIn = self.store.fetchFrameOut(frameInSource, frameInChannel).copy()
      frameOut = frameIn.copy()

      #self.getRGBHisto(frameIn)
      #self.getHSVHisto(frameIn)

      uH = int(self.getCfgVal('upperH'))
      lH = int(self.getCfgVal('lowerH'))
      uS = int(self.getCfgVal('upperS'))
      lS = int(self.getCfgVal('lowerS'))
      uV = int(self.getCfgVal('upperV'))
      lV = int(self.getCfgVal('lowerV'))

      if uH > 360:
        uH = 360
      if lH < 0:
        lH = 0
      if uS > 100:
        uS = 100
      if lS < 0:
        lS = 0
      if uV > 100:
        uV = 100
      if lV < 0:
        lV = 0
      
      applyai.log('%3d %3d %3d %3d %3d %3d' % (uH,lH,uS,lS,uV,lV), self.logname)

      uH = int(uH * 255/360)
      lH = int(lH * 255/360)
      uS = int(uS * 255/100)
      lS = int(lS * 255/100)
      uV = int(uV * 255/100)
      lV = int(lV * 255/100)

      applyai.log('%3d %3d %3d %3d %3d %3d' % (uH,lH,uS,lS,uV,lV), self.logname)

      # remove the wood!
      # the order of hsv       H   S   V
      upper_color = np.array([uH, uS, uV])
      lower_color = np.array([lH, lS, lV])
      
      hsv = cv2.cvtColor(frameOut, cv2.COLOR_BGR2HSV)
      mask = cv2.inRange(hsv, lower_color, upper_color)
      frameOut = cv2.bitwise_and(frameOut, frameOut, mask= mask)

      self.store.updateFrameOut(self.name, 0, frameOut)
      self.store.updateFrameIn(self.name, 0, frameIn)
      return params

    def getRGBHisto(self, frameIn):

      chans = cv2.split(frameIn)
      colors = ("b", "g", "r")

      features = {}
      maxy = 0
      bins = 64
      size = (int(frameIn.shape[1]-200),int((frameIn.shape[0]-200)/2))
      orig = (100,frameIn.shape[0]-100)
      # loop over the image channels
      for (chan, color) in zip(chans, colors):
        # create a histogram for the current channel and
        # concatenate the resulting histograms for each
        # channel
        hist = cv2.calcHist([chan], [0], None, [bins], [0, 256])
        if max(hist) > maxy:
          maxy = max(hist)

        features[color] = hist
        #print(hist)

      cv2.line(frameIn,orig,(orig[0],orig[1]-size[1]),self.color("white"),5)
      cv2.line(frameIn,orig,(orig[0]+size[0],orig[1]),self.color("white"),5)
      #print( size[0])
      #maxy = 100000
      for hist in features:
        idx = 0
        for h in features[hist]:
          x = int(orig[0] + (idx * size[0]/bins))
          y = int(orig[1] - h / maxy * size[1])
          #print(idx,x,y)
          if hist == 'r': 
            cv2.circle(frameIn, (x, y), 10, self.color("red"), 3)
          if hist == 'g': 
            cv2.circle(frameIn, (x, y), 10, self.color("lime"), 3)
          if hist == 'b': 
            cv2.circle(frameIn, (x, y), 10, self.color("blue"), 3)
          idx += 1
      #print(features)
      #print("flattened feature vector size: %d" % (np.array(features).flatten().shape))

    def getHSVHisto(self, frameIn):

      chans = cv2.split(frameIn)
      colors = ("b", "g", "r")

      features = {}
      maxy = 0
      binH = 180
      binS = 256
      size = (int(frameIn.shape[1]-200),int((frameIn.shape[0]-200)/2))
      orig = (100,frameIn.shape[0]-100)

      # Hue and Saturation plot
      hsv = cv2.cvtColor(frameIn,cv2.COLOR_BGR2HSV)
      hist = cv2.calcHist([hsv], [0, 1], None, [binH, binS], [0, 180, 0, 256])

      cv2.line(frameIn,orig,(orig[0],orig[1]-size[1]),self.color("white"),5)
      cv2.line(frameIn,orig,(orig[0]+size[0],orig[1]),self.color("white"),5)
      #print( size[0])
      maxVal = hist.max()
      #for h in hist:
      #  for i in h:
      #    if maxpx > i:
      #      maxpx = i
      print(maxVal)
      scale = 4

      for h in range(binH):
        for s in range(binS):
          binVal = hist[h][s]
          intensity = binVal * 255 / maxVal
          cv2.rectangle( frameIn, (h*scale, s*scale), ( (h+1)*scale - 1, (s+1)*scale - 1), (intensity, intensity, intensity), 2)

      #xidx = 0
      #for h in hist:
        #print(h)
      #  yidx = 0
      #  x = int(orig[0] + xidx / (binsx-1) * (size[0]-200))
      #  for i in h:
      #    y = int(orig[1] - (i * size[1]/maxpx))
          #print(idx,x,y)
        #if hist == 'r': 
      #    cv2.circle(frameIn, (x, y), 3, self.color("red"), 3)
        #if hist == 'g': 
        #  cv2.circle(frameIn, (x, y), 10, self.color("lime"), 3)
        #if hist == 'b': 
        #  cv2.circle(frameIn, (x, y), 10, self.color("blue"), 3)
      #    yidx += 1
      #  xidx += 1
      #print(features)
      #print("flattened feature vector size: %d" % (np.array(features).flatten().shape))

  class PCode(stdPCode):
    
    def __init__(self, name='Color'):
      stdPCode.__init__(self, name)

