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
import imutils

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='Edges'):
      stdAPI.__init__(self, name)

    def main(self, params):

      params['status'] = 0
      frameInSource  = self.getCfgVal('frameIn')
      frameInChannel = self.getCfgVal('channel')
      frameIn = self.store.fetchFrameOut(frameInSource, frameInChannel)

      if False:
        img = cv2.medianBlur(frameIn,5)
        # Create a kernel that we will use to sharpen our image
        kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]], dtype=np.float32)
        # do the laplacian filtering as it is
        # well, we need to convert everything in something more deeper then CV_8U
        # because the kernel has some negative values,
        # and we can expect in general to have a Laplacian image with negative values
        # BUT a 8bits unsigned int (the one we are working with) can contain values from 0 to 255
        # so the possible negative number will be truncated
        imgLaplacian = cv2.filter2D(img, cv2.CV_32F, kernel)
        sharp = np.float32(frameIn)
        imgResult = sharp - imgLaplacian
        # convert back to 8bits gray scale
        imgLaplacian = np.clip(imgLaplacian, 0, 255)
        imgLaplacian = np.uint8(imgLaplacian)

        kernel = np.ones((3,3),np.uint8)
        gray = cv2.erode(imgLaplacian,kernel,iterations = 1)
      else:
        gray = cv2.cvtColor(frameIn,cv2.COLOR_BGR2GRAY)

      frameOut = cv2.Canny(gray, int(self.getCfgVal('cannyThreshold')), 255, apertureSize = 3, L2gradient=True)
      frameOut = cv2.cvtColor(frameOut,cv2.COLOR_GRAY2BGR)
      self.store.updateFrameOut(self.name, 0, frameOut)
      return params


  class PCode(stdPCode):
    
    def __init__(self, name='Edges'):
      stdPCode.__init__(self, name)

