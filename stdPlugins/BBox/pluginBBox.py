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

    def __init__(self, name='BBox'):
      stdAPI.__init__(self, name)

    def main(self, params):

      params['status'] = 0
      frameInSource  = self.getCfgVal('frameIn')
      frameInChannel = self.getCfgVal('channel')
      frameIn = self.store.fetchFrameOut(frameInSource, frameInChannel)
      frameOut = frameIn.copy()

      cols = ["white","red","lime","blue","yellow"]

      # reset targets
      #targets = pd.DataFrame(columns=['plugin'])
      #if not targets.empty:
      #  targets.insert(4,'area',0)
      #  targets.insert(4,'angle',0)
      #else:
      #  targets = pd.DataFrame(columns=['plugin','class','x','y','w','h','area','angle'])
      #self.targets.reset()

      gray=cv2.cvtColor(frameIn, cv2.COLOR_BGR2GRAY)
      contours, hierarchy = cv2.findContours(gray,cv2.RETR_LIST,cv2.CHAIN_APPROX_SIMPLE)[-2:]

      # load variables before the loop
      delta   = int(self.getCfgVal('minDistNextObj'))
      minArea = int(self.getCfgVal('partAreaLower'))
      maxArea = int(self.getCfgVal('partAreaUpper'))

      id = 0
      for cnt in contours:
        area = cv2.contourArea(cnt)
        #print(area)
        if area > minArea and area < maxArea:
          id += 1
          rect = cv2.minAreaRect(cnt)
          
          center, size, angle = rect
          box = cv2.boxPoints(rect)
          box = np.int0(box)

          w = size[0]
          h = size[1]
          if w > h:
            w = size[1]
            h = size[0]
          else:
            angle += 90
          
          # frem here all angles are in radians
          angle = angle * math.pi / 180
          
          cx = center[0]
          cy = center[1]
          limXp = cx + delta
          limXm = cx - delta
          limYp = cy + delta
          limYm = cy - delta

          # list of targets exists - search for duplicate target
          if self.targets.length() > 0:
            found = False
            for index in range(self.targets.length()):
              row = self.targets.read(index)
              if (row['cx'] < limXp) & (row['cx'] > limXm) & (row['cy'] < limYp) & (row['cy'] > limYm):
                found = True
                break
            
            if found:
              # found target - update information here if required
              key = index
              self.targets.set(key,'plugin', self.name)
              self.targets.set(key,'cx', cx)
              self.targets.set(key,'cy', cy)
              self.targets.set(key,'w', w)
              self.targets.set(key,'h', h)
              self.targets.set(key,'area', area)
              self.targets.set(key,'angle', angle)
              idx = int(self.targets.get(key,'class'))
              if idx < len(cols):
                farbe = self.color(cols[idx])
              else:
                farbe = (255,255,255)
              frameOut = cv2.drawContours(frameOut,[box],0,farbe,10)
            else:
              # not found target - add a new target
              self.targets.add(self.name, id, {'class': 0,'cx':cx,'cy':cy,'w':w,'h':h,'angle':angle,'area':area})
              frameOut = cv2.drawContours(frameOut,[box],0,self.color('yellow'),5)

          else: # first in list
            self.targets.add(self.name, id, {'class': 0,'cx':cx,'cy':cy,'w':w,'h':h,'angle':angle,'area':area})
            frameOut = cv2.drawContours(frameOut,[box],0,self.color('yellow'),5)

      #print(targets)
      #for index, row in targets.iterrows(): 
      #  if row['plugin'] == 'BBox':
      #    applyai.log(str(row).replace('\n','|').replace('   ',''),self.logname)

      self.store.updateFrameIn(self.name, 0, frameIn)
      self.store.updateFrameOut(self.name, 0, frameOut)
      return params


  class PCode(stdPCode):
    
    def __init__(self, name='BBox'):
      stdPCode.__init__(self, name)
