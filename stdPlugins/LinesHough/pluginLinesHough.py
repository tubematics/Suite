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
import cv2
import json
import imutils
import math

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='LinesHough'):
      stdAPI.__init__(self, name)

    def main(self, params):

      params['status'] = 0
      frameInSource  = self.getCfgVal('frameIn')
      frameInChannel = self.getCfgVal('channel')
      frameIn = self.store.fetchFrameOut(frameInSource, frameInChannel)
      frameOut = frameIn.copy()

      gray = cv2.cvtColor(frameIn,cv2.COLOR_BGR2GRAY)
      #gray = cv2.Canny(gray, 100, 255, apertureSize = 3, L2gradient=True)

      minL = int(self.getCfgVal('minLength'))
      maxL = int(self.getCfgVal('maxLength'))

      self.plan = params['plan']
      #print(self.plan['roi'])
      for roi in self.plan['roi']:
        if roi['type'] == 1: #'Line':
          roiFrame = frameIn.copy()
          #print(roi)
          p = roi['points']
          box = self.bounding_box(p)
          print(box)
          x1b = int(box[0][0])
          y1b = int(box[0][1])
          x2b = int(box[1][0])
          y2b = int(box[1][1])
          x = int(roi['x']) #.split('.')[0])
          y = int(roi['y']) #.split('.')[0])
          w = int(roi['w']) #.split('.')[0])
          h = int(roi['h']) #.split('.')[0])
          w = x2b - x1b
          h = y2b - y1b
          x0 = x1b # x - int(w/2)
          y0 = y1b # y - int(h/2)
          roiFrame = gray[y0:y0+h, x0:x0+w]
    
          # call hough lines and search for only lines i the direction of p0 p1
          # with a minimum length of p0 - p1
          print(x,y)

          lines = cv2.HoughLinesP(gray, 1, np.pi/180, 100, minLineLength=1500, maxLineGap=150)
          print(len(lines))
          if lines is not None:
            # Draw lines on the image
            for line in lines:
                x1, y1, x2, y2 = line[0]
                #x1 = 100
                #y1 = 100
                x  = 0
                y  = 0
                #x2 = 1000
                #y2 = 1000
                frameOut = cv2.line(frameOut, (x1+x, y1+y), (x2+x, y2+y), self.color("yellow"), 3)
                m  = (y2-y1)/(x2-x1)
                angle = math.atan(m)*180/math.pi
                l  = math.sqrt((x1-x2)**2+(y1-y2)**2)
                cx = (x1+x2)/2+x
                cy = (y1+y2)/2+y
          #      df = df.append({'x1':x1, 'y1':y1, 'x2':x2, 'y2':y2, 'cx':cx, 'cy':cy, 'dim':l, 'angle':angle, 'g':0}, ignore_index=True, sort=False)

      # divide the lines into goups

      # find the median gradient within the group
      # find the end points of the longest line
      #df = df.sort('angle')
      #bins =  np.arange(0,360,10)
      #ind = np.digitize(df['angle'],bins)
      #print(df.groupby(ind).head())

      # group = 1
      # for i1, r1 in df.iterrows():
      #   if r1['g'] == 0:
      #     for i2, r2 in df.iterrows():
      #       if r2['g'] == 0:
      #         if math.fabs(r1['cx'] - r2['cx']) < 100 and math.fabs(r1['cy'] - r2['cy']) < 100:
      #           df.at[i2,'g'] = group
      #     group += 1

      #print(targets)

      self.store.updateFrameOut(self.name, 0, frameOut)
      return params

    def bounding_box(self, points):
      """returns a list containing the bottom left and the top right 
      points in the sequence
      Here, we use min and max four times over the collection of points
      """
      bot_left_x = min(point['x'] for point in points)
      bot_left_y = min(point['y'] for point in points)
      top_right_x = max(point['x'] for point in points)
      top_right_y = max(point['y'] for point in points)

      return [(bot_left_x, bot_left_y), (top_right_x, top_right_y)]

    def sort_contours(self, cnts, method="left-to-right"):
      # initialize the reverse flag and sort index
      reverse = False
      i = 0
    
      # handle if we need to sort in reverse
      if method == "right-to-left" or method == "bottom-to-top":
        reverse = True
    
      # handle if we are sorting against the y-coordinate rather than
      # the x-coordinate of the bounding box
      if method == "top-to-bottom" or method == "bottom-to-top":
        i = 1
    
      # construct the list of bounding boxes and sort them from top to
      # bottom
      boundingBoxes = [cv2.boundingRect(c) for c in cnts]
      (cnts, boundingBoxes) = zip(*sorted(zip(cnts, boundingBoxes),
        key=lambda b:b[1][i], reverse=reverse))
    
      # return the list of sorted contours and bounding boxes
      return (cnts, boundingBoxes)

  class PCode(stdPCode):
    
    def __init__(self, name='LinesHough'):
      stdPCode.__init__(self, name)

