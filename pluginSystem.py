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
import cv2
import json
import requests
import numpy as np
import os
import paho.mqtt.client as mqtt
import time
import subprocess
from datetime import timedelta

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode
from applyai_vision.scheduler import Schedule

#from googletrans import Translator

class applyaiPlugin:

  class API(stdAPI):

    def __init__(self, name='System'):
      stdAPI.__init__(self, name)
      #self.translator = Translator()

    @applyai.expose
    @applyai.tools.json_out()
    def shutdown(self):
      applyai.engine.exit()
      return('done')

    @applyai.expose
    @applyai.tools.json_out()
    def dumptext(self):
      if True:
        for p in self.cfg.store['Project']['plugins']:
          for v in self.cfg.store[p['name']]:
            guiText = self.cfg.store[p['name']][v]['guiText']
            if p['name'] not in self.cfg.store['System']['text']['var']:
              self.cfg.store['System']['text']['var'][p['name']] = {}
            if v not in self.cfg.store['System']['text']['var'][p['name']]:
              self.cfg.store['System']['text']['var'][p['name']][v] = []
              self.cfg.store['System']['text']['var'][p['name']][v].append(guiText)
              #deText = self.translator.translate(guiText, dest='de')
              self.cfg.store['System']['text']['var'][p['name']][v].append(deText.text)

        self.cfg.saveConfigToFile('System')
      else:
        applyai.log('Function switched off', self.logname)
      return('done')

    def getLanguageIndex(self):
      if self.cfg.store['System']['language'] == 'DE':
        return(1)
      return(0) # Default language is EN

    @applyai.expose
    @applyai.tools.json_out()
    def getText(self, typ, plugin, var):
      txt = 'getText error'
      langIdx = self.getLanguageIndex()
      print(langIdx)
      if plugin in self.cfg.store['System']['text']['var']:
        if var in self.cfg.store['System']['text']['var'][plugin]:
          txt = self.cfg.store['System']['text']['var'][plugin][var][langIdx]
      applyai.response.headers['Content-Type'] = "application/json"
      return txt

    @applyai.expose
    @applyai.tools.json_in()
    @applyai.tools.json_out()
    def updateTextFile(self):
      applyai.response.headers['Content-Type'] = "application/json"
      data = {}
      data = applyai.request.json
      path = './sysConfig/Texts.conf'
      with open(path, 'w') as outfile:
        j = json.dumps(data, indent=2, ensure_ascii=False)
        outfile.write(j)
        return(j)
      return({})

    @applyai.expose
    @applyai.tools.json_out()
    def getTextFile(self):
      applyai.response.headers['Content-Type'] = "application/json"
      path = './sysConfig/Texts.conf'
      with open(path, 'r') as infile:
        j = infile.read()
        j = json.loads(j)
        return(j)

    #gcloud auth application-default print-access-token
    def getKey(self):
      ret = subprocess.check_output(["gcloud", "auth", "application-default", "print-access-token"])
      print(str(ret))
      return ret

  class PCode(stdPCode):
    
    def __init__(self, name='System'):
      stdPCode.__init__(self, name)
      self.client = mqtt.Client()
      self.client.on_connect = self.on_connect
      self.client.connect("127.0.0.1", 1883, 60)
      self.client.loop_start()
      self.counter = 0
      self.interval = 1
      self.job = Schedule(interval=timedelta(seconds=self.interval), execute=self.updateStatus)
      self.job.start()
      applyai.engine.subscribe('System/updateLanguage', self.updateLanguage)

    def updateLanguage(self, msg):
      applyai.log('in updateLanguage', self.logname)
      for p in self.cfg.store['Project']['plugins']:
        self.cfg.updateLanguage(p['name'])

    def updateStatus(self):
      self.counter += 1
      self.client.publish('watchdog/' + self.project + '/visionServer', self.counter)

    def stop(self):
      '''Called when the engine stops'''
      self.job.stop()
      if self.client != None:
        self.client.loop_stop(force=False)
        self.client.disconnect()
      applyai.log('Stopping ' + self.logname, self.logname)

    def on_connect(self, client, userdata, flags, rc):
      applyai.log("Connected with result code "+str(rc), self.logname)

      # Subscribing in on_connect() means that if we lose the connection and
      # reconnect then subscriptions will be renewed.
      client.subscribe("$SYS/#")

