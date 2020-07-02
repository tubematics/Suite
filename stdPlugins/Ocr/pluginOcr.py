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
import os
import glob
import json
import pytesseract
import time
import math

from imutils.object_detection import non_max_suppression
from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode
from PIL import Image
from scipy import ndimage


class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='Ocr'):
      stdAPI.__init__(self, name)

    def main(self, params):

      params['status'] = 0
      frameInSource  = self.getCfgVal('frameIn')
      frameInChannel = self.getCfgVal('channel')
      frameIn = self.store.fetchFrameOut(frameInSource, frameInChannel)
      frameOut = frameIn.copy()

      # text detection
      # load image and grab image dimensions
      #image = frameIn
      image = cv2.imread("/home/emily/applyai/gpServer/stdPlugins/Ocr/testImages/achtung.jpg")
      #image = cv2.adaptiveThreshold(image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 2)
      #image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
      #image = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]

      orig = image.copy()
      (origH, origW) = image.shape[:2]

      # set new width and height and then determine the ratio in change for both the w und h
      (newW, newH) = (320, 320)
      rW = origW / float(newW)
      rH = origH / float(newH)

      # resize the image and grab the new image dimensions
      image = cv2.resize(image, (newW, newH))
      (H, W) = image.shape[:2]

      # define the two output layer names for the EAST detector model that
      # we are interested -- the first is the output probabilities and the
      # second can be used to derive the bounding box coordinates of text
      layerNames = [
	      "feature_fusion/Conv_7/Sigmoid",
	      "feature_fusion/concat_3"]

      # load the pre-trained EAST text detector
      print("[INFO] loading EAST text detector...")
      net = cv2.dnn.readNet("./stdPlugins/Ocr/frozen_east_text_detection.pb")

      # construct a blob from the image and then perform a fo ard pass of
      # the model to obtain the two output layer sets
      blob = cv2.dnn.blobFromImage(image, 1.0, (W, H),
        (123.68, 116.78, 103.94), swapRB=True, crop=False)
      start = time.time()
      net.setInput(blob)
      (scores, geometry) = net.forward(layerNames)
      end = time.time()

      # show timing information on text prediction
      print("[INFO] text detection took {:.6f} seconds".format(end - start))
          
      # apply non-maxima suppression to suppress weak, overlapping bounding
      # boxes
      (boxes, confidences) = self.predictions(scores, geometry)
      boxes = non_max_suppression(np.array(boxes), probs=confidences)

      result = []
      padding = 0

      # loop over the bounding boxes
      for (startX, startY, endX, endY) in boxes:
        # scale the bounding box coordinates based on the respective
        # ratios
        startX = int(startX * rW)
        startY = int(startY * rH)
        endX = int(endX * rW)
        endY = int(endY * rH)  

        #padding surrounding the boxes
        dX = int((endX-startX) * padding)
        dY = int((endY-startY) * padding)

        #apply padding
        startX = max(0, startX - dX)
        startY = max(0, startY - dY)
        endX = min(origW, endX + (dX * 2))
        endY = min(origH, endY + (dY * 2)) 

        #extract region of interest
        roi = orig[startY:endY, startX:endX]
        configuration = ("-l eng --oem 1 --psm 8")
        #cv2.imshow('roi', roi)
        #cv2.waitKey(0)

        #OCR
        text = pytesseract.image_to_string(roi, config=configuration)
        #append bbox coordinate and associated text to the list of results 
        result.append(((startX, startY, endX, endY), text))


      orig_image = orig.copy()
      result = sorted(result, key=lambda r:r[0][1])

      for ((start_X, start_Y, end_X, end_Y), text) in result:
        print("{}\n".format(text))

        # Displaying text
        text = "".join([x if ord(x) < 128 else "" for x in text]).strip()
        cv2.rectangle(orig_image, (start_X, start_Y), (end_X, end_Y),
          (0, 0, 255), 2)
        cv2.putText(orig_image, text, (start_X, start_Y - 5),
          cv2.FONT_HERSHEY_SIMPLEX, 0.7,(0,0, 255), 2)



      # draw the bounding box on the image
      frameOut = orig_image


      self.store.updateFrameOut(self.name, 0, frameOut)
      return params


    def predictions(self, scores, geo):
      (numRows, numCols) = scores.shape[2:4]
      rects = []
      confidences = []

      # loop over the number of rows
      for y in range(0, numRows):
        # extract the scores (probabilities), followed by the geometrical
        # data used to derive potential bounding box coordinates that
        # surround text
        scoresData = scores[0, 0, y]
        x0 = geo[0, 0, y]
        x1 = geo[0, 1, y]
        x2 = geo[0, 2, y]
        x3 = geo[0, 3, y]
        anglesData = geo[0, 4, y]

        # loop over the number of columns
        for x in range(0, numCols):
          # if our score does not have sufficient probability, ignore it
          if scoresData[x] < 0.5:
            continue

          # compute the offset factor as our resulting feature maps will
          # be 4x smaller than the input image
          (offsetX, offsetY) = (x * 4.0, y * 4.0)

          # extract the rotation angle for the prediction and then
          # compute the sin and cosine
          angle = anglesData[x]
          cos = np.cos(angle)
          sin = np.sin(angle)

          # use the geometry volume to derive the width and height of
          # the bounding box
          h = x0[x] + x2[x]
          w = x1[x] + x3[x]

          # compute both the starting and ending (x, y)-coordinates for
          # the text prediction bounding box
          endX = int(offsetX + (cos * x1[x]) + (sin * x2[x]))
          endY = int(offsetY - (sin * x1[x]) + (cos * x2[x]))
          startX = int(endX - w)
          startY = int(endY - h)


          # add the bounding box coordinates and probability score to
          # our respective lists
          rects.append((startX, startY, endX, endY))
          confidences.append(scoresData[x])

      return (rects, confidences)

  class PCode(stdPCode):
    
    def __init__(self, name='Ocr'):
      stdPCode.__init__(self, name)
      pass


