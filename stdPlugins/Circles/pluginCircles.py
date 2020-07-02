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

    def __init__(self, name='Circles'):
      stdAPI.__init__(self, name)

    def main(self, params):

      params['status'] = 0
      frameInSource  = self.getCfgVal('frameIn')
      frameInChannel = self.getCfgVal('channel')
      frameIn = self.store.fetchFrameOut(frameInSource, frameInChannel)
      frameOut = frameIn.copy()

      #img = cv2.medianBlur(frameIn,5)
      gray = cv2.cvtColor(frameOut,cv2.COLOR_BGR2GRAY)

      minR = int(self.getCfgVal('minRadius'))
      maxR = int(self.getCfgVal('maxRadius'))
      minD = 50 #int(self.getCfgVal('minDistance'))
      method = 2 # improved accuracy
      
      self.plan = params['plan']
      #if len(self.plan['roi']) == 0:
      #  self.plan['roi'].append(self.initDummyROI(frameIn))

      for roi in self.plan['roi']:
        #applyai.log(str(roi), self.logname)
        if roi['type'] == 2: # 'Circle':
          try:
            if int(roi['maxSize']) > 0:
              maxR = int(roi['maxSize'])
            if int(roi['minSize']) > 0:
              minR = int(roi['minSize'])
            if int(roi['minDistance']) > 0:
              minD = int(roi['minDistance'])
          except:
            applyai.log('using global settings for radius', self.logname)
          #roiFrame = frameIn.copy()
          p = roi['points']
          box = self.bounding_box(p)
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
          circles = cv2.HoughCircles(roiFrame,
                                      cv2.HOUGH_GRADIENT,
                                      2,
                                      minD,
                                      param1=70,
                                      param2=20,
                                      minRadius=minR,
                                      maxRadius=maxR)

          #try:
          print('-------------------------------------------------------3')
          circles = sorted(circles[0,:], key=lambda x: x[0], reverse=False)
          print(str(circles))
          print('-------------------------------------------------------4')
          for idx,i in enumerate(circles):
            if method == 0:                             # TODO - Use when model detctions in targets
              delta = 40
              limXp = i[0] + delta
              limXm = i[0] - delta
              limYp = i[1] + delta
              limYm = i[1] - delta

              c = targets.loc[(targets['x'] < limXp) & (targets['x'] > limXm) & (targets['y'] < limYp) & (targets['y'] > limYm)]
              if c.shape[0] > 0:
                
                ckey = c.index[0]
                targets.at[ckey,'cx'] = i[0]
                targets.at[ckey,'cy'] = i[1]
                targets.at[ckey,'cr'] = i[2]
                targets.at[ckey,'plugin'] = self.name
                # cv2.putText(frameOut, '#' + str(idx), (i[0] + 10, i[1]), cv2.FONT_HERSHEY_SIMPLEX, 1.5, self.color('red'), 5)
                # draw the outer circle
                #cv2.circle(frameOut,(i[0],i[1]),i[2],self.color('lime'),2)
                # draw the center of the circle
                cv2.circle(frameOut,(i[0],i[1]),2,self.color('red'),3)

            elif method == 1:
              dd = 0
              x1 = x0 + i[0] - i[2]/2 - dd
              y1 = y0 + i[1] - i[2]/2 - dd
              x2 = x0 + i[0] + i[2]/2 + dd
              y2 = y0 + i[1] + i[2]/2 + dd
              cx = (x1+x2)/2
              cy = (y1+y2)/2
              r  = i[2]/2
              id = str(roi['id']) + '.' + str(idx)
              self.targets.add(self.name, id, {'type': 'Circle', 'cx':cx,'cy':cy, 'w': r*2,'h': r*2,'angle':0,'dim':r})
              cv2.circle(frameOut,(int(x0+i[0]),int(y0+i[1])),int(i[2]),self.color('yellow'),2)
              # draw the center of the circle
              cv2.circle(frameOut,(int(x0+i[0]),int(y0+i[1])),2,self.color('red'),3)
              # cv2.putText(frameOut, '#' + str(idx), (i[0] + 10, i[1]), cv2.FONT_HERSHEY_SIMPLEX, 1.5, self.color('red'), 5)
            else:
              applyai.log('Circle found in roi (' + str(i) + ')',self.logname)
              dd = i[2] * 0.75
              x1 = int(x0 + i[0] - i[2]/2 - dd)
              y1 = int(y0 + i[1] - i[2]/2 - dd)
              x2 = int(x0 + i[0] + i[2]/2 + dd)
              y2 = int(y0 + i[1] + i[2]/2 + dd)
              cx = (x1+x2)/2
              cy = (y1+y2)/2
              r  = i[2]/2
              #cv2.rectangle(frameOut, (x1,y1), (x2,y2), self.color('red'), 2)
              #roiFrame = gray[y0:y0+h, x0:x0+w]
              houghCircleFrame = gray[y1:y1+y2-y1, x1:x1+x2-x1]
              epos, ea, angle = self.improveAccuracyOfCircles(houghCircleFrame, minR, maxR)
              cx = x1 + epos[0]
              cy = y1 + epos[1]
              r = (ea[0] + ea[1]) / 4
              id = str(roi['id']) + '.' + str(idx)
              self.targets.add(self.name, id, {'type': 'Circle', 'cx':cx,'cy':cy, 'w': r*2,'h': r*2,'angle':0,'dim':r})
              cv2.circle(frameOut,(int(cx),int(cy)),int(r),self.color('yellow'),2)
              # draw the center of the circle
              cv2.circle(frameOut,(int(cx),int(cy)),2,self.color('red'),3)
              applyai.log('Circle (%.3f,%.3f,%.3f)' % (cx,cy,r),self.logname)
              # cv2.putText(frameOut, '#' + str(idx), (i[0] + 10, i[1]), cv2.FONT_HERSHEY_SIMPLEX, 1.5, self.color('red'), 5)
          #except:
          #  applyai.log('No circles found in roi (id=' + str(roi['id']) + ')',self.logname)

      self.store.updateFrameOut(self.name, 0, frameOut)
      return params

    def improveAccuracyOfCircles(self, houghCircleFrame, minR, maxR):

      ex = ey = MA = ma = angle = 0
      contours, hierarchy = cv2.findContours(houghCircleFrame, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)[-2:]  #cv2.findContours(image, mode, method
      for i, cnt in enumerate(contours):
        if i > 0 and len(cnt) > 5:
          (ex,ey), (MA,ma), angle = cv2.fitEllipse(cnt)
          if MA/2 < maxR and ma/2 > minR:
            applyai.log(str('Improved Circle Ellipse %.3f %.3f %.3f %.3f' % (ex,ey,MA,ma)), self.logname)
            #cv2.ellipse(frameOut, ((cx,cy),(MA,ma),angle), (0,255,0), 3)

      return (ex,ey), (MA,ma), angle

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

    def initDummyROI(self, frameIn):
      roi = {}
      roi["id"] = 1
      roi["nickname"] = "ROI_1"
      roi["type"] = "Circle"
      roi["points"] = []
      roi["points"].append({"x": 0, "y": 0})
      roi["points"].append({"x": frameIn.shape[1], "y": 0})
      roi["points"].append({"x": frameIn.shape[1], "y": frameIn.shape[0]})
      roi["points"].append({"x": 0, "y": frameIn.shape[0]})
      roi["max"] = 0
      roi["min"] = 0
      roi["x"] = 0
      roi["y"] = 0
      roi["w"] = frameIn.shape[1]
      roi["h"] = frameIn.shape[0]
      return roi

 
  class PCode(stdPCode):
    
    def __init__(self, name='Circles'):
      stdPCode.__init__(self, name)


