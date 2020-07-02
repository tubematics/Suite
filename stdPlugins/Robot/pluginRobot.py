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
from cherrypy import tools
import time, signal
from datetime import timedelta
import random
import cv2
import numpy as np
import applyai_job
import RV3_CMD_IO
import cvbasics

cvb = cvbasics.cvbasics()

from applyai_APIClass import stdAPI
from applyai_APIClass import stdPCode

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='Robot'):
      stdAPI.__init__(self, name)

      self.status = {
          'x': 0.0,
          'y': 0.0,
          'z': 0.0,
          'a': 0.0,
          'b': 0.0,
          'c': 0.0,
          'bMoving': False,
          'bPosValid': True,
          'bCMD_Running': False,
          'bGS_Valid': True
        }
      applyai.engine.subscribe(self.logname.strip() + '/status', self.updateStatus)

    def updateStatus(self, status):
      self.status = status

    @applyai.expose
    @applyai.tools.json_out()
    def getStatus(self):
      return self.status

  class PCode(stdPCode):
    
    def __init__(self, name='Robot'):
      stdPCode.__init__(self, name)
      self.status = {
          'x': 380.0,
          'y': -45.0,
          'z': 150.0,
          'a': 0.0,
          'b': 0.0,
          'c': -90.0,
          'bMoving': False,
          'bPosValid': True,
          'bCMD_Running': False,
          'bGS_Valid': False
        }
      self.base = {
          'x': 380.0,
          'y': -45.0,
          'z': 150.0,
          'a': 0.0,
          'b': 0.0,
          'c': -90.0
        }
      self.interval = 0.1
      self.job = applyai_job.Job(interval=timedelta(seconds=self.interval), execute=self.updateStatus)
      self.job.start()
      self.myRV3 = RV3_CMD_IO.classRV3_CMD_IO()    # Class-Instanzierung
      self.myRV3.startRun()

      self.exportConfigVariable(1, 'number', 'limitAxisA', 27, "\u00b0", "Limit of axis B +/-", '')
      self.exportConfigVariable(1, 'number', 'limitAxisB', 27, "\u00b0", "Limit of axis B +/-", '')
      self.cfg = self.updateConfig()
      self.saveConfig()

      applyai.log('background task started interval = ' + str(self.interval) + ' seconds',self.logname)
      applyai.engine.subscribe(self.name + '/move', self.robiMove)
      applyai.engine.subscribe(self.name + '/base', self.robiBase)

    def updateStatus(self, params = {}):
      
      # at the moment this just updates the position of the robot
      # application wide
      applyai.engine.publish(self.name + '/status', self.status)

    def start(self, params):

      applyai.log('start pick parts ..', self.logname)
      
      targets = params['targets']
      params['targets'] = self.pickParts(targets)
      self.robiBase(params)

      self.store.updateParams(self.name, params)
      applyai.engine.publish(self.name + '/finished',params)
      applyai.log('finished', self.logname)

    def stop(self):

      self.myRV3.stopRun()
      self.job.stop()
      self.monitor.stop()
      applyai.log('stopping job', self.logname)

    def pickParts(self, targets):

      frameIn = cv2.imread('../common/images/frame_003_00.jpg')
      frameOut = frameIn.copy()

      xHome = 380
      yHome = -45
      zHome = 150
      cHome = -90
      xCamera = -5
      yCamera = -71

      zPart = 96.5

      pos = self.status
      #pos['x'] += 100
      self.robiMove(pos)
      self.robiMove({'x':380,'y':-45,'z':150,'a':0,'b':0,'c':-90})
      #targets = targets[(targets.xmm > xHome-100) & (targets.xmm < xHome+100)]
      #targets = targets[(targets.ymm > yHome-100) & (targets.ymm < yHome+200)]

      #print(targets)
      # search for blobs = congregations of nuts
      blobs = targets.copy()
      blobs = blobs[blobs.side == 0]     # remove classified = Nuts
      #print("------------------> Blobs")
      for index, row in blobs.iterrows():
          center = (row['cx'],row['cy'])
          size   = (row['sx'],row['sy'])
          angle  = row['w']
          box = cv2.boxPoints((center, (size[0],size[1]), angle))
          box = np.int0(box)
          cv2.drawContours(frameOut,[box],0,cvb.colYellow,5)

      blobs = blobs.sort_values(by=['ymm'])
      # print(blobs)

      # # update the analysed image
      # fname = str("../common/images/frame_%03d_%02d_analysed.jpg" % (1, 0))
      # cv2.imwrite(fname, framesOut[0])
      
      # print("------------------> Targets")
      # print(targets)
      # # search for nuts
      # targets = targets[targets.side > 0]     # remove unclassified
      # targets = targets[targets.d > 0.8]      # remove not enough steel
      # targets = targets[targets.w != 0.0]     # remove edge detection failed
      # targets = targets[targets.a < 40000.0]  # remove too large to be a single nut

      # print("------------------> Targets")
      # print(targets)

      # endTime = datetime.datetime.now()
      # print("------------------> Time %d ms" % (int((endTime-startTime).microseconds/1000)))
    
      #time.sleep(3.4)
      if len(targets) > 0:

          for t, target in targets.iterrows():

              applyai.log('Pick target ' + str(t) + '-------------------------', self.logname)
              s = target['side']
              x = target['xmm']
              y = target['ymm']
              z = zPart
              c = cHome-target['w']

              # stats.read()
              # stats.cycleTime()
              # stats.insertCycletime(1)
              
              self.robiMovePos(x,y,zHome,0,0,c)
              self.robiMovePos(x,y,z+10,0,0,c)
              self.robiMovePos(x,y,z+0 ,0,0,c)
              #robiMove("GRFZ")
              time.sleep(0.004)
              #robiMove("GRFA")
              self.robiMovePos(x,y,z+50,0,0,c)
              if True: #s == 2.0:
                  self.robiMovePos(350,-266,zHome,0,0,0) # Box
                  time.sleep(0.1)
                  #robiMove("GRFA")
              else:
                  # Wendestation Top to drop part - change x and y
                  robiMovePos(471,-165,155,0,0,0)
                  robiMovePos(471,-165,150,0,0,0)
                  time.sleep(0.1)
                  #robiMove("GRFA")
                  time.sleep(0.1)
                  # Wendestation Bottom to pick up part - change x and y
                  robiMovePos(445,-166,155,0,0,0)
                  robiMovePos(445,-166,102,0,0,0)
                  #robiMove("GRFZ")
                  time.sleep(0.4)
                  robiMovePos(445,-166,zHome,0,0,0)
                  robiMovePos(300,-266,zHome,0,0,0) # Box
                  time.sleep(0.1)
                  #robiMove("GRFA")

              # stats.incrementScrew(1)
              # stats.insertCycletime(2)
              # stats.updateCycletime()
              # stats.write()
      else:
          for b, blob in blobs.iterrows():
              x = blob['xmm']
              y = blob['ymm']
              self.robiMovePos(x,y+80,zHome,0,0,-45)
              self.robiMovePos(x,y+30,zPart+5,0,0,45)
              self.robiMovePos(x,y-50,zPart+0,0,0,-45)
              break
      
      self.robiMovePos(xHome,yHome,zHome,0,0,cHome)
      self.store.updateTargets(targets)
      return targets

    def robiBase(self, params):
      applyai.log('return to base ..', self.logname)
      self.robiMove(self.base)
      return

  #--------------------------------------------------------------------------------
    def robiMovePos(self, x, y, z, a, b, c):   # --- Robi mouving ---
      ziel = {
          'x': x,
          'y': y,
          'z': z,
          'a': a,
          'b': b,
          'c': c
        }
      self.robiMove(ziel)
      return

  #--------------------------------------------------------------------------------
    def robiMove(self, tp):   # --- Robi mouving ---

      strCMD = self.myRV3.formatPosCmd(tp['x'],tp['y'],tp['z'],tp['a'],tp['b'],tp['c'])
      error = False
      #
      #strCMD = "G0PO +0000.00 +0000.00 +0151.00 +0000.00 +0000.00 +0000.00 +000"  # Test
      # Ermittle Focus für Kamera in Abhänigkeit von Z 
      newFocus = 0
      if len(strCMD) >= 4:
          if strCMD[:4] == "GOGS":
              newFocus = 5
              myWC.setFocus(newFocus)
      #
      if len(strCMD) >= 32:
        if strCMD[:4] == "GOPO":
          #          1         2         3         4         5         6
          #012345678901234567890123456789012345678901234567890123456789012
          #GOPO +0350.00 +0000.00 +0300.00 +0000.00 -0000.00 +0000.00 +020

          newXPos = float(strCMD[ 5:13])
          newYPos = float(strCMD[14:22])
          newZPos = float(strCMD[23:31])
          #
          # arrFocus = None
          # iRET, strVAL = myWC.getCfgValue("camera", "Focus")
          # if iRET == 0:
          #   arrFocus = strVAL
          # #
          # newFocus = 0
          # if newZPos != None and arrFocus != None:
          #   for f, z in arrFocus.items():
          #     if newZPos <= float(z):
          #       newFocus = int(f[1:])
          # #
          # myWC.setFocus(newFocus)
          #if newXPos > 500 or newXPos < 250:
          #    error = True
          #if newYPos > 180 or newYPos < -350:
          #    error = True
          #if newZPos < Boden:
          #    error = True
      #
      #
      applyai.log(strCMD, self.logname)
      #log.logout(log.logType.INFO, "robiMove", strCMD)
      if error == False:
        ret = self.myRV3.sendCMD(strCMD)
        if ret != 0:
            exit()
        
