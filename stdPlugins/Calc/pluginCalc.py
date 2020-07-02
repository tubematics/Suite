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
import cv2
import requests
import json

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='Calc'):
      stdAPI.__init__(self, name)
      self.cc = 0

    def main(self, params):

      targets  = params['targets']
      frameIn  = self.store.fetchFrameIn(self.name, 0)
      frameOut = frameIn.copy()

      #--------------------------------------------------------
      if params['sequence'] == 'detect':
      #--------------------------------------------------------
        self.cc += 1
        cv2.putText(frameOut, 'Detections ' + str(self.cc), (100, 100), cv2.FONT_HERSHEY_SIMPLEX, 3, self.color('lime'), 5)

      #--------------------------------------------------------
      if params['sequence'] == 'setScale':
      #--------------------------------------------------------
        # access config Parts NOT calc
        # fetch the cfg from parts
        partCfg = requests.get("http://localhost:5000/Part/getConfig").json()

        cr = 0
        targets = targets[targets.plugin == 'Ellipse']
        for index, row in targets.iterrows():
          cr += row['cr']

        if len(targets.index) > 0:
          cr = cr/len(targets.index)
          #self.cfg['scaleX']['value'] = partCfg['dimX']['value'] / cr
          #self.cfg['scaleY']['value'] = partCfg['dimY']['value'] / cr

      #--------------------------------------------------------
      if params['sequence'] == 'calibrate':
      #--------------------------------------------------------
        pass

      #for index, row in targets.iterrows(): 
      #  applyai.log(str(row).replace('\n','|').replace('      ',''), self.logname)
      self.store.updateFrameOut(self.name, 0, frameOut)
      self.store.updateTargets(targets)
      return targets

  class PCode(stdPCode):
    
    def __init__(self, name='Calc'):
      stdPCode.__init__(self, name)
