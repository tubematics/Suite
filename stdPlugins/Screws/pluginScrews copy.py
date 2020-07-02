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

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='Screws'):
      stdAPI.__init__(self, name)

    def main(self, params):

      frameIn = self.store.fetchFrameIn(self.name, 0)
      frameOut = self.store.fetchFrameOut('Mask', 0).copy()

      minThreadLen = int(self.getCfgVal('minThreadLength'))
      minHeadWidth = int(self.getCfgVal('minHeadWidth'))
      maxHeadWidth = int(self.getCfgVal('maxHeadWidth'))
      minHeadHeight = int(self.getCfgVal('minHeadHeight'))
      maxHeadHeight = int(self.getCfgVal('maxHeadHeight'))

      gray=cv2.cvtColor(frameIn, cv2.COLOR_BGR2GRAY)
      for phase in range(2):
        # the first phase matches the threads and heads
        # after the previous plugin isolated the threads
        # by shortening them with 2 black lines
        # the second phase rejoins the thread tip to the screw
        self.targets.reset() # ['plugin','class','xh','yh','x','y','w','h','area','dim','angle']
        contours, hierarchy = cv2.findContours(gray,cv2.RETR_LIST,cv2.CHAIN_APPROX_SIMPLE)[-2:]
        id = 0
        for cnt in contours:
          area = cv2.contourArea(cnt)
          #print(area)
          if area > 3000 and area < 40000:
            rect = cv2.minAreaRect(cnt)
            center, size, angle = rect
            x, y = center
            w, h = size
            if w > h:
              w = size[1]
              h = size[0]
            else:
              angle += 90

            angle = angle * math.pi/180 # change to radians like the rest
            # threads        
            if h > minThreadLen:
              self.targets.add(self.name, id, {'class':'Thread', 'cx':x,'cy':y,'dim':0,'w':w,'h':h,'angle':angle})
              id += 1
              #x1 = x + h/2 * math.cos(angle)
              #x2 = x - h/2 * math.cos(angle)
              #y1 = y + h/2 * math.sin(angle)
              #y2 = y - h/2 * math.sin(angle)
              # cv2.line(frameOut,(int(x1),int(y1)),(int(x2),int(y2)),self.color('yellow'),5)

            # heads
            if h > minHeadWidth and h < maxHeadWidth and w > minHeadHeight and w < maxHeadHeight:
              self.targets.add(self.name, id, {'class':'Head', 'cx':x,'cy':y,'dim':0,'w':w,'h':h,'angle':angle})
              id += 1
              # cv2.circle(frameOut, (int(x),int(y)), 50, self.color("yellow"), 5)

        # loop over all threads
        for i1 in range(self.targets.length()):
          r1 = self.targets.read(i1)
          if r1['class'] == 'Thread':
            x = r1['cx']
            y = r1['cy']
            w = r1['w']
            h = r1['h']
            angle = r1['angle']
            x1 = x + h/2 * math.cos(angle)
            x2 = x - h/2 * math.cos(angle)
            y1 = y + h/2 * math.sin(angle)
            y2 = y - h/2 * math.sin(angle)
            m = (y1-y2)/(x1-x2)
            c = y1 - m*x1           # y=mx+c  c=y-mx

            # ---------------------------------------------------
            # Search for the closest head along the line of the thread
            # TODO - this may not always find the correct head
            # ---------------------------------------------------
            dmin = 9999
            imin = -1
            for i2 in range(self.targets.length()):
              r2 = self.targets.read(i2)
              if r2['class'] == 'Head':
                xh = r2['cx']
                yh = r2['cy']
                d = math.fabs((c + m*xh - yh) / math.sqrt(1 + m**2))
                d1 = math.sqrt((xh-x1)**2+(yh-y1)**2)
                d2 = math.sqrt((xh-x2)**2+(yh-y2)**2)
                d3 = min(d1,d2)
                #print('#',i1,i2,d)
                if d < dmin and d3 < 200:
                  dmin = d
                  imin = i2
                  x1t = x + h/2 * math.cos(angle)
                  x2t = x - h/2 * math.cos(angle)
                  y1t = y + h/2 * math.sin(angle)
                  y2t = y - h/2 * math.sin(angle)
                  if d1 > d2:
                    cv2.circle(gray, (int(x1t),int(y1t)), 10, self.color("white"), -1)
                  else:                
                    cv2.circle(gray, (int(x2t),int(y2t)), 10, self.color("white"), -1)

            # ---------------------------------------------------
            # Adjust the targets and add a few fields of interest
            # ---------------------------------------------------
            if imin >= 0 and phase:
              self.targets.set(imin,'class','Screw')
              xh = self.targets.get(imin,'cx')
              yh = self.targets.get(imin,'cy')
              #self.targets.set(imin,'xh',xh)
              #self.targets.set(imin,'yh',yh)
              d1 = math.sqrt((xh-x1)**2+(yh-y1)**2)
              d2 = math.sqrt((xh-x2)**2+(yh-y2)**2)
              if d1 > d2:
                self.targets.set(imin,'dim', d1)
                #self.targets.set(imin,'angle', self.getAngle((xh,yh),(x1,y1))) #*180/math.pi-90) % 360)
                cv2.line(frameOut,(int(x1),int(y1)),(int(xh),int(yh)),self.color('lime'),10)
              else:
                self.targets.set(imin,'dim', d2)
                #self.targets.set(imin,'angle', self.getAngle((xh,yh),(x2,y2))) #*180/math.pi-90) % 360)
                cv2.line(frameOut,(int(x2),int(y2)),(int(xh),int(yh)),self.color('lime'),10)
              
              cv2.circle(frameOut, (int(xh),int(yh)), 30, self.color("lime"), -1)
              cv2.putText(frameOut, str("%02d" % imin), (int(xh-20), int(yh+8)), cv2.FONT_HERSHEY_SIMPLEX, 1, self.color('black'), 2)

      self.targets.removeByClass('Thread')
      self.targets.removeByClass('Head')

      self.store.updateFrameOut(self.name, 0, frameOut)
      return params

    def getAngle(self, p1, p2):
      dx = p2[0] - p1[0]
      dy = p2[1] - p1[1]
      inRads = math.atan2(dy, dx)

      # We need to map to coord system when 0 degree is at 3 O'clock, 270 at 12 O'clock
      if inRads < 0:
          inRads = math.fabs(inRads)
      else:
          inRads = 2 * math.pi - inRads

      return inRads

  class PCode(stdPCode):
    
    def __init__(self, name='Screws'):
      stdPCode.__init__(self, name)
