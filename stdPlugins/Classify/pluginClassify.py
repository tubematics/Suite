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

    def __init__(self, name='Classify'):
      stdAPI.__init__(self, name)

    def main(self, params):

      targets = params['targets']
      frameOut = self.store.fetchFrameOut('Mask', 0).copy()

      cols = [(255,255,255),(0,255,255),(255,255,0),(0,255,0)]

      if not targets.empty:

        targets['plugin'] = self.name
        targetSelection = self.getTargetSelections(targets)
        #print(targetsSelect)
        for idx, ts in enumerate(targetSelection):
          applyai.log('class ' + str(idx+1) + ' ' + ts, self.logname)
          tsp = ts.split(' & ')
          if len(tsp) == 1:
            targets.loc[(eval(tsp[0])),'class'] = idx+1
          if len(tsp) == 2:
            targets.loc[(eval(tsp[0]))&(eval(tsp[1])),'class'] = idx+1
          if len(tsp) == 3:
            targets.loc[(eval(tsp[0]))&(eval(tsp[1]))&(eval(tsp[2])),'class'] = idx+1
          if len(tsp) == 4:
            targets.loc[(eval(tsp[0]))&(eval(tsp[1]))&(eval(tsp[2]))&(eval(tsp[3])),'class'] = idx+1

        for idx, row in targets.iterrows():
          cv2.putText(frameOut,
                      "#" + str(idx) + '_' + str(int(row['class'])),
                      (int(row['x'])-30, int(row['y'])+20),
                      cv2.FONT_HERSHEY_SIMPLEX, 1.5,
                      cols[int(row['class'])], 5)

      self.store.updateFrameOut(self.name, 0, frameOut)
      self.store.updateTargets(targets)
      return targets

    def getTargetSelections(self, targets):
      #select = ['h>250&w<100','h>250&w>127','h>250&w>=100&w<=127']
      opts = ['==','>','>=','<','<=','error']
      targetSelection = []
      fstr = ""
      for i in range(10):
        s = self.getCfgVal('select' + str(i+1))
        if s != "":
          formula = s.split('&')
          for f in formula:
            # TODO same operation twice in one formula ? error
            for o in opts:
              if o in f:
                fp = f.split(o)
                if fp[0] not in targets.columns:
                  applyai.log('$Error - Class selection string format error ' + f, self.logname)
                  break
                fstr += 'targets["' + fp[0] + '"]' + o + fp[1]
                if f != formula[-1]:
                  fstr += ' & '
                break
              if o == 'error':
                applyai.log('$Error - Class selection string format error ' + f, self.logname)
          targetSelection.append(fstr)
          fstr = ""
        else:
          break
      return targetSelection



  class PCode(stdPCode):
    
    def __init__(self, name='Classify'):
      stdPCode.__init__(self, name)
