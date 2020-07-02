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

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='Part'):
      stdAPI.__init__(self, name)
      applyai.engine.subscribe(self.name + '/base', self.apiFn)

    def main(self, params):
      applyai.log('in API main from part', self.logname)
      return params

    def stop(self):
      applyai.engine.unsubscribe(self.name + '/base', self.apiFn)

    def apiFn(self, arg):
      applyai.log('this was called internally', self.logname)

    @applyai.expose
    def getStlFile(self, filename):
      path = '../common/stl/'
      with open(path + filename, 'rb') as infile:
        stl = infile.read()

      applyai.response.headers['Content-Type'] = "model/stl"
      return(stl)

  class PCode(stdPCode):
    
    def __init__(self, name='Part'):
      stdPCode.__init__(self, name)

    def main(self, params):

      frameIn  = self.store.fetchFrameIn(self.name, 0)
      frameOut = frameIn.copy()

      self.store.updateFrameOut(self.name, 0, frameOut)
      return params
