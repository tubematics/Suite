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

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='FillHoles'):
      stdAPI.__init__(self, name)
      
    def main(self, params):

      targets = params['targets']
      frameIn = self.store.fetchFrameIn(self.name, 0)
      frameOut = frameIn.copy()

      #x = int(self.cfg['topLeftX']['value'])
      #y = int(self.cfg['topLeftY']['value'])
      #w = frameIn.shape[1] + int(self.cfg['btmRightX']['value'])
      #h = frameIn.shape[0] + int(self.cfg['btmRightY']['value'])

      # Threshold.
      # Set values equal to or above 220 to 0.
      # Set values below 220 to 255.
      
      th, im_floodfill = cv2.threshold(frameIn, 220, 255, cv2.THRESH_BINARY_INV);
      
      # Copy the thresholded image.
      #im_floodfill = frameIn.copy()
      
      # Mask used to flood filling.
      # Notice the size needs to be 2 pixels than the image.
      h, w = frameIn.shape[:2]
      mask = np.zeros((h+2, w+2), np.uint8)
      
      # Floodfill from point (0, 0)
      cv2.floodFill(frameOut, mask, (0,0), 255)
      
      # Invert floodfilled image
      im_floodfill_inv = cv2.bitwise_not(im_floodfill)
      
      # Combine the two images to get the foreground.
      frameOut = frameIn | im_floodfill_inv

      cv2.imwrite('../projects/' + self.project + '/images/im_floodfill.jpg', im_floodfill)
      cv2.imwrite('../projects/' + self.project + '/images/im_floodfill_inv.jpg', im_floodfill_inv)
      cv2.imwrite('../projects/' + self.project + '/images/mask.jpg', mask)
      cv2.imwrite('../projects/' + self.project + '/images/frameIn.jpg', frameIn)
      cv2.imwrite('../projects/' + self.project + '/images/frameOut.jpg', frameOut)

      self.store.updateFrameOut(self.name, 0, frameOut)
      self.store.updateTargets(targets)
      return targets

  class PCode(stdPCode):
    
    def __init__(self, name='FillHoles'):
      stdPCode.__init__(self, name)

