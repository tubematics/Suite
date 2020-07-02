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
import numpy as np
import cv2

class imgStore:

  store = {}
  maxChannels = 4

  def __init__(self, name):
    self.add(name)

  def add(self, name):
    if name not in imgStore.store:
      imgStore.store[name] = {}
      imgStore.store[name]['name'] = name
      imgStore.store[name]['frameIn']  = []
      imgStore.store[name]['frameOut'] = []
      for i in range(imgStore.maxChannels):
        img = self.create_background(600,100)
        imgStore.store[name]['frameIn'].append(img)
        imgStore.store[name]['frameOut'].append(img.copy())
  
  def updateFrameIn(self, name, cam, frameIn):
    if name in imgStore.store:
      if cam < imgStore.maxChannels:
        imgStore.store[name]['frameIn'][cam] = frameIn
    else:
      self.add(name)
      if cam < imgStore.maxChannels:
        imgStore.store[name]['frameIn'][cam] = frameIn

  def updateFrameOut(self, name, cam, frameOut):
    if name in imgStore.store:
      if cam < imgStore.maxChannels:
        imgStore.store[name]['frameOut'][cam] = frameOut
    else:
      self.add(name)
      if cam < imgStore.maxChannels:
        imgStore.store[name]['frameOut'][cam] = frameIn

  def fetch(self, name):
    if name in imgStore.store:
      return imgStore.store[name]
    return {}

  def fetchFrameIn(self, name, camera=0):
    if name in imgStore.store:
      camera = int(camera)
      if camera < len(imgStore.store[name]['frameIn']):
        return imgStore.store[name]['frameIn'][camera]
    return self.create_blank(600,100)

  def fetchFrameOut(self, name, camera=0):
    if name in imgStore.store:
      camera = int(camera)
      if camera < len(imgStore.store[name]['frameOut']):
        return imgStore.store[name]['frameOut'][camera]
    return self.create_blank(600,100)

  def print(self):
    for s in imgStore.store:
      print(imgStore.store[s]['name'])

  def create_blank(self, width, height, rgb_color=(0, 0, 0)):
    """Create new image(numpy array) filled with certain color in RGB"""
    # Create black blank image
    image = np.zeros((height, width, 3), np.uint8)

    # Since OpenCV uses BGR, convert the color first
    color = tuple(reversed(rgb_color))
    # Fill image with color
    image[:] = color

    cv2.putText(image, "applyAI Vision system waiting", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 1.1, (255,255,255), 3)
    cv2.putText(image, "for image capture signal ...", (20, 80), cv2.FONT_HERSHEY_SIMPLEX, 1.1, (255,255,255), 3)
    return image

  def create_background(self, width, height, rgb_color=(0, 0, 0)):
    """Create new image(numpy array) filled with certain color in RGB"""
    # Create black blank image
    image = cv2.imread('./sysConfig/startup-bg.jpg')

    # Since OpenCV uses BGR, convert the color first
    #color = tuple(reversed(rgb_color))
    # Fill image with color
    #image[:] = color

    cv2.putText(image, "applyAI Vision system waiting", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 1.1, (255,255,255), 3)
    cv2.putText(image, "for image capture signal ...", (20, 80), cv2.FONT_HERSHEY_SIMPLEX, 1.1, (255,255,255), 3)
    return image

if __name__ == "__main__":
  
  frameIn  = []
  frameOut = []
  frameIn.append(255 * np.ones(shape=[512, 512, 3], dtype=np.uint8))
  frameOut.append(255 * np.ones(shape=[512, 512, 3], dtype=np.uint8))

  ms = imgStore('Camera')
  ms.add('Mask')
  ms.add('Model')

  o = ms.fetch('Calc')

  ms.print()
