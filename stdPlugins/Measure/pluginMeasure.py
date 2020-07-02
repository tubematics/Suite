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
import datetime
import math
import random
import glob

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='Measure'):
      stdAPI.__init__(self, name)
      self.svg = [] #pd.DataFrame(columns=['id','x1','y1','x2','y2','cx','cy'])
      self.moiId = 0
      self.scaleX = 1
      self.scaleY = 1

    def main(self, params):

      params['status'] = 0
      frameInSource  = self.getCfgVal('frameIn')
      frameInChannel = self.getCfgVal('channel')
      frameIn = self.store.fetchFrameOut(frameInSource, frameInChannel)
      frameOut = frameIn.copy()

      #print(targets)
      self.scaleX = float(self.getCfgVal('scaleX'))
      self.scaleY = float(self.getCfgVal('scaleY'))

      self.plan = params['plan']
      self.svg[:] = [] #self.svg[0:0]
      self.moiId = 0

      self.addBasicElementsToSVG()
      # Add construction lines and middle lines here
      self.addConstructionElementsToSVG()
      self.calculateMeasurementsFromSVG(frameOut)

      plan = params['plan']
      order = params['order']
      # Build the record which will be saved
      record = {}
      record['date'] = self.getDTMSString()
      record['part'] = order['part']
      record['order'] = order['order']
      record['machine'] = order['machine']
      record['status'] = 0
      record['values'] = []
      status = 0 # noch ist alles gut
      error = False
      # grab the mois
      try:
        for coi in plan['coi']:
          # update measurements from targets

          ut = float(coi['ut'])
          lt = float(coi['lt'])
          mw = {}
          targetId = coi['formula']
          applyai.log('TargetID: ' + str(targetId), self.logname)
          if targetId != '':
            value = self.targets.loc('id',targetId)['dim']
          else:
            value = (ut+lt)/2
          #print(status, ut, lt, value)
          # Random number generator for NOK testingscenarios
          #value += (random.random() - 0.5) / 20
          mw['v'] = str("%08.3f" % float(value))
          mw['s'] = 0
          if float(mw['v']) > ut:
            mw['s'] = 1
            status = 1
          if float(mw['v']) < lt:
            mw['s'] = 1
            status = 1
          #print(mw)
          record['values'].append(mw)
 
          cx = self.targets.loc('id',targetId)['cx']
          cy = self.targets.loc('id',targetId)['cy']
          self.insertStatusSymbol(frameOut, cx, cy, mw['s'])
        
        record['status'] = status
      except Exception as e: # work on python 3.x
        applyai.log('ERROR'+ str(e.message), self.logname)
        error = True

      self.store.updateFrameOut(self.name, 0, frameOut)
      params['record'] = {}
      params['record'] = record
      applyai.log(str(params['record']), self.logname)
      return params

    def insertStatusSymbol(self, img, cx, cy, status):
      x = int(cx / self.scaleX)
      y = int(cy / self.scaleY)
      x -= (45 + 25)
      y -= (15 + 10)
      if status == 0:
        cv2.circle(img, (x, y), 20, self.color('lime'), -1)
      else:
        cv2.circle(img, (x, y), 20, self.color('red'), -1)


    def addBasicElementsToSVG(self):

      for index in range(self.targets.length()):
        row = self.targets.read(index)
        applyai.log(str(row), self.logname)
        if row['type'] == 'Circle':
          self.svg.append({'id': 'CP.' + row['id'],'cx': row['cx'],'cy': row['cy']})
          x1 = row['cx'] - row['w']/2 * math.cos(math.pi/4)
          y1 = row['cy'] - row['w']/2 * math.sin(math.pi/4)
          self.svg.append({'id': 'CP.' + row['id'] + '.1','cx': x1,'cy': y1})
        if row['type'] == 'Line':
          x1 = row['cx'] - row['w']/2 * math.cos(row['angle'])
          y1 = row['cy'] - row['w']/2 * math.sin(row['angle'])
          x2 = row['cx'] + row['w']/2 * math.cos(row['angle'])
          y2 = row['cy'] + row['w']/2 * math.sin(row['angle'])
          self.svg.append({'id': 'L.'  + row['id'],'x1': x1,'y1': y1,'x2': x2,'y2': y2})
          self.svg.append({'id': 'LP.' + row['id'] + '.1','cx': x1,'cy': y1})
          self.svg.append({'id': 'LP.' + row['id'] + '.2','cx': x2,'cy': y2})
          self.svg.append({'id': 'LP.' + row['id'] + '.3','cx': row['cx'],'cy': row['cy']})


    def addConstructionElementsToSVG(self):

      applyai.log('Searching for middlelines ----- ', self.logname)
      for moi in self.plan['moi']:
        lid = int(moi['path'].split('~')[0].split('.')[1])
        p = moi['path'].split('~')
        pts = []
        if p[1] == 'L2LM':
          applyai.log(moi['path'], self.logname)
          #print(lid)
          ptsReq = self.getNoOfPtsRequired(p[1])
          for i in range(2, len(p)):
            id = p[i]
            if id.find('LP') == 0 or id.find('MP') == 0 or id.find('CP') == 0:
              pt = self.getPointsFromSVG(id)
              #print(pt)
              pts.append(pt)
              if len(pts) >= ptsReq:
                x1 = pts[0][0]
                y1 = pts[0][1]
                x2 = pts[1][0]
                y2 = pts[1][1]
                x3 = pts[2][0]
                y3 = pts[2][1]
                x4 = pts[3][0]
                y4 = pts[3][1]
                self.svg.append({'id': 'L.'  + str(lid + 100), 'x1': (x1+x2)/2,'y1': (y1+y2)/2,'x2': (x3+x4)/2,'y2': (y3+y4)/2})
                self.svg.append({'id': 'LP.' + str(lid + 100) + '.1','cx': (x1+x2)/2,'cy': (y1+y2)/2})
                self.svg.append({'id': 'LP.' + str(lid + 100) + '.2','cx': (x3+x4)/2,'cy': (y3+y4)/2})
                self.svg.append({'id': 'LP.' + str(lid + 100) + '.3','cx': (x1+x2+x3+x4)/4,'cy': (y1+y2+y3+y4)/4})


    def calculateMeasurementsFromSVG(self, frameOut):

      applyai.log('Calculating measurements ----- ', self.logname)
      for moi in self.plan['moi']:
        id = int(moi['path'].split('~')[0].split('.')[1])
        if id > self.moiId:
          self.moiId = id
        applyai.log(str(self.moiId) + '|' + str(moi), self.logname)
        pts = []
        p = moi['path'].split('~')
        #print(p)
        ptsReq = self.getNoOfPtsRequired(p[1])
        for i in range(2, len(p)):
          id = p[i]
          if id.find('LP') == 0 or id.find('MP') == 0 or id.find('CP') == 0:
            pt = self.getPointsFromSVG(id)
            #print(pt)
            pts.append(pt)
            if ptsReq >= len(pts) and len(pts) >= 2:
              idx = p[0].split('.')[1]
              cx, cy, w, h, angle, dist = self.calcSvgPoints(frameOut, moi['path'], idx, pts, ptsReq)
            if ptsReq == len(pts):
              self.targets.add(self.name, p[0], {'type': p[1], 'cx': cx, 'cy': cy, 'w': w, 'h': h, 'dim':dist, 'angle': angle})

    # TODO scaleX amd scaleY are not implemented correctly
    # We require two sets of coordinates (px and mm) for all points
    def calcSvgPoints (self, frameOut, path, moiId, pts, ptsReq):
      dist = 0
      angle = 0
      cx = 0
      cy = 0
      w = 0
      h = 0
      calc = path.split('~')[1]
      if len(pts) == 2 and ptsReq == 2 and calc != 'Radius':
        self.insertLine(frameOut, path, pts[0][0], pts[0][1], pts[1][0], pts[1][1]) #, ignore_index=True, sort=False)
        dist = math.sqrt((pts[0][2]-pts[1][2])**2+(pts[0][3]-pts[1][3])**2) # in mm
        #dist += (random.random() - 0.5) / 13
        cx = int((pts[0][0]+pts[1][0])/2)
        cy = int((pts[0][1]+pts[1][1])/2)
        self.insertMeasurement(frameOut,dist,cx,cy,0)
        angle = math.atan2(pts[0][1] - pts[1][1], pts[0][0] - pts[1][0])

      if len(pts) == 3 and ptsReq == 3:
        m = (pts[0][1] - pts[1][1]) / (pts[0][0] - pts[1][0])
        c = pts[1][1] - m * pts[1][0]
        x = (pts[2][0] + m * pts[2][1] - m * c) / (m ** 2 + 1)
        y = c + m * (pts[2][0] + m * pts[2][1] - m * c) / (m ** 2 + 1)
        m_mm = (pts[0][3] - pts[1][3]) / (pts[0][2] - pts[1][2])
        c_mm = pts[1][3] - m_mm * pts[1][2]
        x_mm = (pts[2][2] + m_mm * pts[2][3] - m_mm * c_mm) / (m_mm ** 2 + 1)
        y_mm = c_mm + m_mm * (pts[2][2] + m_mm * pts[2][3] - m_mm * c_mm) / (m_mm ** 2 + 1)
        id = 'MP.' + str(self.moiId) + '.4'
        #self.insertArc(frameOut, id, x, y, 6)
        self.insertLine(frameOut, path, x, y, pts[2][0], pts[2][1]) #, ignore_index=True, sort=False)
        dist = math.fabs(c_mm + m_mm * pts[2][2] - pts[2][3]) / (math.sqrt(1 + m_mm * m_mm))
        dist += (random.random() - 0.5) / 20
        #dist += (random.random() - 0.5) / 250
        cx = int((x+pts[2][0])/2)
        cy = int((y+pts[2][1])/2)
        self.insertMeasurement(frameOut,dist,cx,cy,0)
        angle = math.atan2(y - pts[2][1], x - pts[2][0])

      if len(pts) == 4 and calc == 'L2L':
        id = 'MP.' + str(self.moiId) + '.5'
        #applyai.log('inserting line ' + id, self.logname)
        #self.svg = self.svg.append({'id': path,'x1': pts[0][0],'y1': pts[0][1],'x2': pts[1][0], 'y2': pts[1][1]}, ignore_index=True, sort=False)
        #self.svg = self.svg.append({'id': path,'x1': pts[2][0],'y1': pts[2][1],'x2': pts[3][0], 'y2': pts[3][1]}, ignore_index=True, sort=False)
        x1 = (pts[0][0]+pts[1][0])/2
        y1 = (pts[0][1]+pts[1][1])/2
        x2 = (pts[2][0]+pts[3][0])/2
        y2 = (pts[2][1]+pts[3][1])/2
        dist = math.sqrt((self.scaleX*(x1-x2))**2+(self.scaleY*(y1-y2))**2)
        #dist += (random.random() - 0.5) / 250
        cx = int((x1+x2)/2)
        cy = int((y1+y2)/2)
        self.insertMeasurement(frameOut,dist,cx,cy,0)
        #self.insertArc(frameOut, path, x1, y1, 6)
        #self.insertArc(frameOut, path, x2, y2, 6)
        self.insertLine(frameOut, path, x1, y1, x2, y2)
        angle = math.atan2(y1 - y2, x1 - x2)

      if len(pts) == 4 and calc == 'LLP':
        a = (pts[0][1] - pts[1][1]) / (pts[0][0] - pts[1][0])
        b = (pts[2][1] - pts[3][1]) / (pts[2][0] - pts[3][0])
        c = pts[1][1] - a * pts[1][0]
        d = pts[3][1] - b * pts[3][0]
        x = (d - c) / (a - b)
        y = a * x + c
        id = 'MP.' + str(self.moiId) + '.5'
        #applyai.log('inserting point ' + id, self.logname)
        self.insertArc(frameOut, id, x, y, 6)
        self.insertLine(frameOut, path, x, y, pts[0][0], pts[0][1])
        self.insertLine(frameOut, path, x, y, pts[3][0], pts[3][1])
        self.insertArc(frameOut, id, pts[0][0], pts[0][1], 6)
        self.insertArc(frameOut, id, pts[3][0], pts[3][1], 6)
        angle = math.atan2(y - pts[0][1], x - pts[0][0]) - math.atan2(y - pts[3][1], x - pts[3][0])

      if len(pts) == 2 and calc == 'RAD':
        x1 = pts[0][0]-pts[1][0]
        y1 = pts[0][1]-pts[1][1]
        distPx = math.sqrt((x1)**2+(y1)**2)
        dist = math.sqrt((self.scaleX*(x1))**2+(self.scaleY*(y1))**2)
        applyai.log(str('%0.3f %0.3f %0.3f' % (x1, y1, dist)), self.logname)
        id = 'MP.' + str(self.moiId) + '.0'
        #applyai.log('inserting point ' + id, self.logname)
        x = pts[0][0] + dist * math.cos(math.pi/4)
        y = pts[0][1] + dist * math.sin(math.pi/4)
        self.insertLine(frameOut, path, int(pts[1][0]), int(pts[1][1]), int(x), int(y))
        x = pts[0][0] + distPx * math.cos(-3*math.pi/4)
        y = pts[0][1] + distPx * math.sin(-3*math.pi/4)
        self.insertMeasurement(frameOut,dist,int(x),int(y),math.pi/4)
        angle = math.pi / 4
        
      if len(pts) == 4 and calc == 'ANG':
        a = (pts[0][1] - pts[1][1]) / (pts[0][0] - pts[1][0])
        b = (pts[2][1] - pts[3][1]) / (pts[2][0] - pts[3][0])
        c = pts[1][1] - a * pts[1][0]
        d = pts[3][1] - b * pts[3][0]
        x = (d - c) / (a - b)
        y = a * x + c
        id = 'MP.' + str(self.moiId) + '.5'
        #applyai.log('inserting point ' + id, self.logname)
        self.insertArc(frameOut, id, x, y, 6)
        self.insertLine(frameOut, path, x, y, pts[0][0], pts[0][1])
        self.insertLine(frameOut, path, x, y, pts[3][0], pts[3][1])
        self.insertArc(frameOut, id, pts[0][0], pts[0][1], 6)
        self.insertArc(frameOut, id, pts[3][0], pts[3][1], 6)
        angle = math.fabs(math.atan(a) - math.atan(b))
        dist = angle * 180.0 / math.pi
        self.insertMeasurement(frameOut,dist,int(x),int(y),math.pi/4)
        
      return(cx*self.scaleX, cy*self.scaleY, dist, 0.001, angle, dist)

    def insertMeasurement(self, img, dist, x, y, angle):
      applyai.log('dist %0.3f, x %d, y %d' % (dist, x, y), self.logname)
      x = int(x)
      y = int(y)
      x -= 45
      y -= 15
      cv2.putText(img, str("%0.3f" % dist), (x, y), cv2.FONT_HERSHEY_SIMPLEX, 1, self.color('black'), 5)
      cv2.putText(img, str("%0.3f" % dist), (x, y), cv2.FONT_HERSHEY_SIMPLEX, 1, self.color('white'), 2)

    def insertArc(self, img, id, x, y, r):
      self.svg.append({'id': id,'cx': x,'cy': y, 'r': r})
      cv2.circle(img,(int(x),int(y)),int(r),self.color('aqua'), 3)

    def insertLine(self, img, id, x1, y1, x2, y2):
      self.svg.append({'id': id, 'x1': x1,'y1': y1, 'x2': x2,'y2': y2})
      cv2.line(img,(int(x1), int(y1)), (int(x2), int(y2)),self.color('aqua'), 3)

    def getPointsFromSVG (self, id):
      p = [0,0]
      for s in self.svg:
        if s['id'] == id:
          return[float(s['cx']), float(s['cy']), float(s['cx'])*self.scaleX, float(s['cy'])*self.scaleY]
      #for s in self.svg:
      #  print(s)
      applyai.log('$Error - id ' + id + ' not found getPointsFromSVG', self.logname)
      return (p)
    
    def getNoOfPtsRequired (self, tool):
      switcher = {
        'P2P': 2,
        'L2P': 3,
        'L2L': 4,
        'L2LM': 4,
        'LLP': 4,
        'C2P': 2,
        'C2L': 3,
        'C2C': 2,
        'ANG': 4,
        'Radius':2
      }
      return switcher.get(tool,4)

    def getDTString(self):
      return(datetime.datetime.now().replace(microsecond=0).isoformat())

    def getDTMSString(self):
      return(datetime.datetime.now().isoformat()[:-3])

    def getDateString(self):
      return(self.getDTString().split('T')[0])


  class PCode(stdPCode):
    
    def __init__(self, name='Measure'):
      stdPCode.__init__(self, name)

