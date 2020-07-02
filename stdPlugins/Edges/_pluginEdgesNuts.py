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
import isolateForeground
import cvbasics

from applyai_APIClass import stdAPI
from applyai_APIClass import stdPCode

cvb = cvbasics.cvbasics()

class API(stdAPI):

  def __init__(self, name='Edges'):
    stdAPI.__init__(self, name)

class PCode(stdPCode):
  
  def __init__(self, name='Edges'):
    stdPCode.__init__(self, name)
    self.threshold = self.loadValue('threshold')

  def start(self, params):

    applyai.log('starting ..', self.logname)
    params['targets'], params['frameOut'] = self.main(params)

    applyai.engine.publish(self.name + '/finished',params)

  def main(self, params):

    targets = params['targets']
    step = 2
    cam = 0

    frameIn  = params['frameIn']
    frameOut = frameIn.copy()

    bw_img = cv2.cvtColor(frameIn,cv2.COLOR_BGR2GRAY)

    fname = str("../projects/%s/images/blackandwhite.jpg" % self.project)
    cv2.imwrite(fname, bw_img)

    thresh, im_floodfill, im_floodfill_inv, im_out = isolateForeground.isolateForeground(bw_img, self.threshold)
    no_noise = isolateForeground.removeNoise(im_out)

    fname = str("../projects/%s/images/thresh.jpg" % self.project)
    cv2.imwrite(fname, thresh)
    fname = str("../projects/%s/images/no_noise.jpg" % self.project)
    cv2.imwrite(fname, no_noise)
    
    if cv2.__version__ == '3.4.7':
      _, contours, hierarchy = cv2.findContours(no_noise,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_SIMPLE)
    else:
      contours, hierarchy = cv2.findContours(no_noise,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_SIMPLE)

    applyai.log("length of contours %d" % len(contours), self.logname)
    if len(contours) == 0:
      return targets.iloc[0:0]

    hierarchy = hierarchy[0] # get the actual inner list of hierarchy descriptions
    maxContour = max(contours, key = cv2.contourArea)
    (mx,my),mr = cv2.minEnclosingCircle(maxContour)

    for contour, hier in zip(contours, hierarchy):

      area, solidity = self.calcSolidity(contour)
      rect = cv2.minAreaRect(contour)
      center, size, angle = rect
      cx = center[0]                # Center of box better than circle
      cy = center[1]
      #box = cv2.boxPoints((center, (size[0]+5,size[1]+5), angle))
      #box = np.int0(box)

      minDistance = 25
      limitArea = 2000
      limitSize = 50
      if frameIn.shape[1] == 4096:
        limitArea = 4000
        limitSize = 100
        minDistance = 50

      d = minDistance
      limXp = cx+d
      limXm = cx-d
      limYp = cy+d
      limYm = cy-d
      
      abSide = 0
      #print("%7.1f %4d %4d %7.1f" % (area, size[0], size[1], solidity))
      #if area > 4000 and size[0] > 100 and size [1] > 100 and solidity > 0.5:
      if area > limitArea and size[0] > limitSize and size [1] > limitSize and solidity > 0.5:

        center,radius = cv2.minEnclosingCircle(contour)
        c = targets.loc[(targets['cx'] < limXp) 
                      & (targets['cx'] > limXm) 
                      & (targets['cy'] < limYp) 
                      & (targets['cy'] > limYm) 
                      & (targets['s'] == (step-1))]
        if c.shape[0] == 0:
          targets = targets.append(
                {'s':step,'cx':cx,'cy':cy,'sx':(size[0]+5),'sy':(size[1]+5),'hx':int(cx),'hy':int(cy),'hr':int(radius),'xmm':0,'ymm':0,'a':area,'c':cam,'d':solidity,'w':angle, 'side': abSide,'score':0},
                ignore_index=True)
          ckey = len(targets)
        else:
          ckey = c.index[0]

        targets.at[ckey,'s']    = step
        targets.at[ckey,'w']    = angle
        targets.at[ckey,'a']    = area
        targets.at[ckey,'d']    = solidity
        targets.at[ckey,'hx']   = int(cx)
        targets.at[ckey,'hy']   = int(cy)
        #if radius < 120:
        #applyai.log('before ----------------', self.logname)
        self.checkGripperPosition(targets, ckey, bw_img, frameOut, contour)
        #applyai.log('after  ----------------', self.logname)

    targets = targets.dropna(subset=['side']) # remove all rows with nan in 'side'
    params["frameOut"] = frameOut
    applyai.log('finished',self.logname)
    self.store.updateTargets(targets)
    return targets

  #--------------------------------------------------------
  def checkGripperPosition(self, targets, ckey, frameIn, frameOut, contour):

    schwelle = 20

    colGripPos = [[],[],[],[],[]]
    gw = 0.15 # size of 50% of part + 15% of part for gripper

    #print('in checkGripperPosition ' + str(ckey))
    rect = cv2.minAreaRect(contour)
    center, size, angle = rect
    if size[0] < 200 and size [1] < 200:

      gray = frameIn #cv2.cvtColor(frameIn, cv2.COLOR_BGR2GRAY)

      mask = np.zeros(gray.shape, np.uint8)
      cv2.drawContours(mask, contour, -1, 255, -1)
      colGripPos[0] = cv2.mean(gray, mask=mask)

      cx = center[0] + (size[0] * (0.55+gw)) * math.cos(angle*math.pi/180)
      cy = center[1] + (size[0] * (0.55+gw)) * math.sin(angle*math.pi/180)
      box = cv2.boxPoints(((cx, cy), (size[0]*2*gw,size[1]), angle))
      box = np.int0(box)
      mask = np.zeros(gray.shape, np.uint8)
      cv2.drawContours(mask, [box], -1, 255, -1)
      colGripPos[1] = cv2.mean(gray, mask=mask)
      if colGripPos[1][0] < schwelle:
        cv2.drawContours(frameOut, [box], 0, cvb.colGreen, 3)
      else:
        cv2.drawContours(frameOut, [box], 0, cvb.colRed, 3)

      cx = center[0] - (size[0] * (0.55+gw)) * math.cos(angle*math.pi/180)
      cy = center[1] - (size[0] * (0.55+gw)) * math.sin(angle*math.pi/180)
      box = cv2.boxPoints(((cx, cy), (size[0]*2*gw,size[1]), angle))
      box = np.int0(box)
      mask = np.zeros(gray.shape, np.uint8)
      cv2.drawContours(mask, [box], -1, 255, -1)
      colGripPos[2] = cv2.mean(gray, mask=mask)
      if colGripPos[2][0] < schwelle:
        cv2.drawContours(frameOut, [box], 0, cvb.colGreen, 3)
      else:
        cv2.drawContours(frameOut, [box], 0, cvb.colRed, 3)

      cx = center[0] - (size[0] * (0.55+gw)) * math.sin(angle*math.pi/180)
      cy = center[1] + (size[0] * (0.55+gw)) * math.cos(angle*math.pi/180)
      box = cv2.boxPoints(((cx, cy), (size[0],size[1]*2*gw), angle))
      box = np.int0(box)
      mask = np.zeros(gray.shape, np.uint8)
      cv2.drawContours(mask, [box], -1, 255, -1)
      colGripPos[3] = cv2.mean(gray, mask=mask)
      if colGripPos[3][0] < schwelle:
        cv2.drawContours(frameOut, [box], 0, cvb.colGreen, 3)
      else:
        cv2.drawContours(frameOut, [box], 0, cvb.colRed, 3)

      cx = center[0] + (size[0] * (0.55+gw)) * math.sin(angle*math.pi/180)
      cy = center[1] - (size[0] * (0.55+gw)) * math.cos(angle*math.pi/180)
      box = cv2.boxPoints(((cx, cy), (size[0],size[1]*2*gw), angle))
      box = np.int0(box)
      mask = np.zeros(gray.shape, np.uint8)
      cv2.drawContours(mask, [box], -1, 255, -1)
      colGripPos[4] = cv2.mean(gray, mask=mask)
      if colGripPos[4][0] < schwelle:
        cv2.drawContours(frameOut, [box], 0, cvb.colGreen, 3)
      else:
        cv2.drawContours(frameOut, [box], 0, cvb.colRed, 3)
      
      #print(colGripPos)
      if colGripPos[1][0] < schwelle and colGripPos[2][0] < schwelle:
        return
      if colGripPos[3][0] < schwelle and colGripPos[4][0] < schwelle:
        targets.at[ckey,"w"] = targets.at[ckey,"w"] + 90
        return
      targets.at[ckey,"w"]   = 0
      targets.at[ckey,"d"]   = 0
    return
   #--------------------------------------------------------
  def calcSolidity(self, contour):

    area = cv2.contourArea(contour)
    hull = cv2.convexHull(contour)
    hull_area = cv2.contourArea(hull)
    solidity = 0
    if hull_area > 0:
      solidity = float(area)/hull_area
    return area, solidity

