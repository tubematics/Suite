import cherrypy as applyai
import numpy as np
import cv2
import json
import datetime
import requests
import os
import random
import threading

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode

import paho.mqtt.client as mqtt

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='Document'):
      stdAPI.__init__(self, name)
      # create a mqtt client
      self.client = mqtt.Client()
      self.client.on_connect = self.on_connect
      self.client.connect("127.0.0.1", 1883, 60)
      self.client.loop_start()

    def stop(self):
      '''Called when the engine stops'''
      if self.client != None:
        self.client.loop_stop(force=False)
        self.client.disconnect()

    def on_connect(self, client, userdata, flags, rc):
      applyai.log("Connected with result code "+str(rc), self.logname)
      # Subscribing in on_connect() means that if we lose the connection and
      # reconnect then subscriptions will be renewed.
      client.subscribe("$SYS/#")

    def mqttPublish(self, obj):
      msg = str(obj).replace("'",'"')
      self.client.publish('status/' + self.project + '/' + self.name, msg)

    def main(self, params):

      params['status'] = 0
      frameInSource  = self.getCfgVal('frameIn')
      frameInChannel = self.getCfgVal('channel')
      frameIn = self.store.fetchFrameOut(frameInSource, frameInChannel)
      frameOut = frameIn.copy()

      plan = params['plan']
      order = params['order']
      record = params['record']

      # get the date string
      date = record['date'].split('T')[0]
      zeit = record['date'].split('T')[1]

      # create stats directory if required
      path = '../projects/' + self.project + '/stats/' + record['part']
      if not os.path.isdir(path):
        os.mkdir(path)
      path += '/' + date
      if not os.path.isdir(path):
        os.mkdir(path)

      filename = record['part'] + '~' + record['order'] + '.json'
      path += '/' + filename

      # save to stats
      self.writeStatsFile(path, record)

      # TODO Watermark images make to flexible
      txt = 'applyAI Vision '
      txt += record['date'].replace('T',' ')
      txt += '/' + record['part']
      txt += '/' + record['order']
      txt += '/' + record['machine']
      txt += '/' + str(record['status'])
      for v in record['values']:
        txt += '/' + str(v['v'])

      # Watermark image if required
      if self.getCfgVal('watermark') == 'Standard':
        cv2.putText(frameOut, txt, (10, frameOut.shape[0]-20), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 1)
      
      # TODO if nok and selected archive image(s)
      # create image directory if required
      path = '../projects/' + self.project + '/images/' + record['part']
      if not os.path.isdir(path):
        os.mkdir(path)
      path += '/' + date
      if not os.path.isdir(path):
        os.mkdir(path)

      support = (self.getCfgVal('imageStorageType') == 'Support')
      applyai.log('Support flag: ' + str(support), self.logname)
      #support = False
      self.store.updateFrameOut(self.name, 0, frameOut)
      if self.getCfgVal('saveImages') == '100%':
        self.flushImages(path, zeit, support)
      elif (record['status'] != 0 and self.getCfgVal('saveImages') == 'NOK'):
        self.flushImages(path, zeit, support)

      # TODO demoVar replace with some global counter
      #demoVar = int(self.getCfgVal('demo'))
      #demoVar += 1
      #self.setCfgVal('demo', demoVar)
      #cv2.putText(frameOut, 'demoVar:' + str(demoVar), (100, 200), cv2.FONT_HERSHEY_SIMPLEX, 3, (0,255,0), 5)

      params['record'] = record
      params['targets'] = self.targets.fetch()
      self.mqttPublish(params)
      return params
  
    def writeStatsFile(self, path, record):
      recordStr = json.dumps(record, ensure_ascii=False).replace(', "',',"').replace(': ',':').replace(' {','{') + '\n'
      with open(path, 'a') as outfile:
        outfile.write(recordStr)

    def flushImages(self, path, zeit, allFilesFlag):
       # when the process is finished save the images for analysis
       applyai.log('flushing image to disk for analysis', self.logname)
       for p in self.cfg.store['Project']['plugins']:
         if p['name'] == self.name or allFilesFlag:

          frameOutFile = str('%s/%s_%s.jpg' % (path, p['name'], zeit))
          q = self.getCfgVal('imageQuality')
          if allFilesFlag:
            q = '100%'
          
          applyai.log('writing: ' + frameOutFile + ' with quality ' + q, self.logname)

          encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), int(q[:-1])]
          image = self.store.fetchFrameOut(p['name'],0)

          #cv2.imwrite(frameOutFile, image, encode_param)
          x = threading.Thread(target=self.writeImage, args=(frameOutFile,image,encode_param))
          x.start()

    def writeImage(self, filename, image, encode_param):
      cv2.imwrite(filename, image, encode_param)

    def getDTString(self):
      return(datetime.datetime.now().replace(microsecond=0).isoformat())

    def getDTMSString(self):
      return(datetime.datetime.now().isoformat()[:-3])

    def getDateString(self):
      return(self.getDTString().split('T')[0])

  class PCode(stdPCode):
    
    def __init__(self, name='Document'):
      stdPCode.__init__(self, name)

