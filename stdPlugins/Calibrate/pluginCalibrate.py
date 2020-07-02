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

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='Calibrate'):
      stdAPI.__init__(self, name)
      self.objpoints = list(self.getCfgVal('objPoints'))
      self.imgpoints = list(self.getCfgVal('imgPoints'))

    def main(self, params):

      params['status'] = 0
      frameInSource  = self.getCfgVal('frameIn')
      frameInChannel = self.getCfgVal('channel')
      frameIn = self.store.fetchFrameOut(frameInSource, frameInChannel)
      frameOut = frameIn.copy()
      noOfImages = int(self.getCfgVal('noOfImages'))
      imgCounter = int(self.getCfgVal('imgCounter'))

      counter = imgCounter + 1
      self.setCfgVal('imgCounter', counter)
      img_counter = int(self.getCfgVal('imgCounter'))

      #prepare object points, like (0,0,0), (1,0,0), (2,0,0) ....,(6,5,0)
      objp = np.zeros((6*9,3), np.float32)
      objp[:,:2] = np.mgrid[0:9,0:6].T.reshape(-1,2)

      gray = cv2.cvtColor(frameIn, cv2.COLOR_BGR2GRAY)

      ##### GET CALIBRATION IMAGES#####
      if img_counter < noOfImages:
        applyai.log('Collecting calibration image ' + str(img_counter) + '  of  ' + str(noOfImages), self.logname)
        #save Image in Folder
        img_name="calibration_img_{}.png".format(img_counter)
        cv2.imwrite('./stdPlugins/Calibrate/Calibration_Images/' + img_name, frameIn)
        
        #Find the chessboard corners
        ret, corners = cv2.findChessboardCorners(gray, (9,6),None)

        #If found, add object points, image points
        if ret == True:
          #--OBJPOINTS
          self.objpoints.append(objp)
          
          #--IMGPOINTS
          criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.001)
          corners2 = cv2.cornerSubPix(gray,corners,(11,11),(-1,-1),criteria)
          self.imgpoints.append(corners2)
 
          #Draw and display corners
          frameOut = cv2.drawChessboardCorners(frameIn, (9,6), corners2,ret)
          cv2.putText(frameOut, 'imgCounter:' + str(img_counter), (100, 200), cv2.FONT_HERSHEY_SIMPLEX, 3, (0,255,0), 5)
        

      ##### CALIBRATE ##############
      if img_counter == noOfImages or img_counter > noOfImages:
        applyai.log('Calibrating', self.logname)
        ret, mtx, dist, rvecs, tvecs = cv2.calibrateCamera(self.objpoints, self.imgpoints, gray.shape[::-1],None,None) 
        
        #Save parameters into numpy file
        np.save("../projects/Calibrate/calibrations/ret", ret)
        np.save("../projects/Calibrate/calibrations/mtx", mtx)
        np.save("../projects/Calibrate/calibrations/dist", dist)
        np.save("../projects/Calibrate/calibrations/rvecs", rvecs)
        np.save("../projects/Calibrate/calibrations/tvecs", tvecs)

        #ERROR
        tot_error = 0
        for i in range(len(self.objpoints)):
          imgpoints2, _ = cv2.projectPoints(self.objpoints[i], rvecs[i], tvecs[i], mtx, dist)
          error = cv2.norm(self.imgpoints[i],imgpoints2, cv2.NORM_L2)/len(imgpoints2)
          tot_error += error

        msg = 'mean error: ' + str(tot_error/len(self.objpoints))
        applyai.log(msg, self.logname)
        cv2.putText(frameOut, msg, (100, 200), cv2.FONT_HERSHEY_SIMPLEX, 3, (0,255,0), 5)

        mtx, dist = self.loadCalibrationParametersFromFile()
        self.undistortImage(mtx, dist)

      self.store.updateFrameOut(self.name, 0, frameOut)
      return params
    
    
    def loadCalibrationParametersFromFile(self):
      mtx = np.load('../projects/Calibrate/calibrations/mtx.npy')
      dist = np.load('../projects/Calibrate/calibrations/dist.npy')
      return mtx, dist

    def undistortImage(self, mtx, dist):
      img = cv2.imread('./stdPlugins/Calibrate/Calibration_Images/calibration_img_1.png')
      h,  w = img.shape[:2]
      size = (w, h)
      newcameramtx, roi=cv2.getOptimalNewCameraMatrix(mtx,dist,size,1,size)
          
      #UNDISTORT
      applyai.log('undistorted', self.logname)
      frameOut = cv2.undistort(img, mtx, dist, None, newcameramtx)
      cv2.imwrite('../projects/Calibrate/calibrations/undistortedFrame.png', frameOut)


  class PCode(stdPCode):
    
    def __init__(self, name='Calibrate'):
      stdPCode.__init__(self, name)
      pass


