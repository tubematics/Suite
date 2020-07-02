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
import numpy as np
import os
from configparser import SafeConfigParser
import codecs
import requests
import paho.mqtt.client as mqtt
import time, datetime
import math
import glob
from shutil import copyfile
#from pandas.io.json import json_normalize

from applyai_vision.APIClass import stdAPI
from applyai_vision.APIClass import stdPCode
#import applyai_vision.stats as stats

class applyaiPlugin:

  frames = []

  class API(stdAPI):

    def __init__(self, name='Project'):
      stdAPI.__init__(self, name)
      self.lastParamsResp = {}

    @applyai.expose
    @applyai.tools.json_out()
    def test(self, plugin=""):
      applyai.engine.publish('/Project/' + plugin + '/test', plugin) # first project code
      return({'info':plugin + '/start initiated'})

    @applyai.expose
    @applyai.tools.json_out()
    def listProjects(self):
      ls = []
      path = "../projects"
      for each in os.listdir(path):
        if os.path.isdir(os.path.join(path, each)):
          ls.append(each)
      return(ls)

    @applyai.expose
    @applyai.tools.json_out()
    def listPlugins(self):
      ls = []
      path = './stdPlugins'
      if os.path.isdir(path):
        for each in os.listdir(path):
          if each.find('.') < 0 and each.find('__') < 0:
            ls.append(each)
      return(sorted(ls))

    @applyai.expose
    @applyai.tools.json_out()
    def listParts(self, index="0", count="10"):
      ls = []
      allJsonFiles = []
      path = '../projects/' + os.environ['PROJECT'] + '/parts'
      if os.path.isdir(path):
        allJsonFiles = sorted(glob.glob(path + '/*.json'))
        sorted(allJsonFiles, reverse=False)
        for idx, each in enumerate(allJsonFiles):
          if idx >= int(index) and idx < int(index) + int(count):
            #print(idx, index, count, each)
            planName = each.split('/')[-1]
            oss = os.path.getmtime(each)
            #ts = time.ctime(oss).st_atime
            ts = time.localtime(oss)
            tsIso = time.strftime('%Y-%m-%d %H:%M:%S', ts)
            tz = str.format('{0:+06.2f}', -float(time.altzone) / 3600)
            final = tsIso + tz
            #final = isodate.datetime_isoformat(oss) + str.format('{0:+06.2f}', -float(time.timezone) / 3600).replace('.', ':')
            longname = planName.replace('.json','').split('~')
            if len(longname) > 1:
              ls.append({
                  "number": longname[0],
                  "version": longname[1],
                  "ts": final
                })
      res = {}
      res['total'] = len(allJsonFiles)
      res['list'] = ls
      return(res)

    @applyai.expose
    @applyai.tools.json_out()
    def getPart(self, number="", version="1"):

      # Define the default plan structure here
      default = '{"number": "Test", "name": "New Test Plan", "version": "1", "stl": "", "coi": ['
      default += '{"id": 0,"name": "Test","type": 0,"ut": "1.1","uw": "1.05","nm": "1.0","lw": "0.95","lt": "0.9","units": "mm","formula": ""}'
      default += '], "roi": [], "moi": []}'
      j = json.loads(default)

      applyai.log('in getPart', self.logname)
      path = '../projects/' + os.environ['PROJECT'] + '/parts'
      if os.path.isdir(path):
        # list ignoring the version number
        listing = sorted(glob.glob('../projects/' + os.environ['PROJECT'] + '/parts/' + number + '~*.json'))
        applyai.log(str(listing), self.logname)
        if len(listing) > 0:
          # load the latest (highest version number) plan
          filename = listing[-1]
          applyai.log(filename, self.logname)
          if os.path.isfile(filename):
            with open(filename, 'r') as infile:
              j = infile.read()
              j = json.loads(j)
      return(j)

    @applyai.expose
    @applyai.tools.json_out()
    def delPart(self, number="", version="1"):

      applyai.log('in delPart', self.logname)
      path = '../projects/' + os.environ['PROJECT'] + '/parts'
      if os.path.isdir(path):
        listing = glob.glob('../projects/' + os.environ['PROJECT'] + '/parts/*.json')
        applyai.log(str(listing), self.logname)
        for filename in listing:
          if number + '~' + version in filename:
            applyai.log(filename + " found and deleted", self.logname)
            os.remove(filename)
            return('{"msg":"deleted"}')
      return('{"msg":"file not found"}')

    @applyai.expose
    @applyai.tools.json_in()
    @applyai.tools.json_out()
    def savePart(self, name="", version="1"):
      version = int(version)
      applyai.log('in savePart', self.logname)
      path = '../projects/' + os.environ['PROJECT'] + '/parts'
      data = applyai.request.json
      if os.path.isdir(path):
        filename = path + '/' + name + '~' + str(version) + '.json'
        applyai.log(filename, self.logname)
        with open(filename, 'w') as outfile:
          outfile.write(json.dumps(data, indent=2, ensure_ascii=False))
        return('{"msg":"Success"}')
      return('{"msg":"Error"}')

    @applyai.expose
    @applyai.tools.json_out()
    def getLatestMeasuredValuesFile(self, part = "", order = "", count="-100"):
      j = '{}'
      if part != '' and order != '':
        count = int(count)
        dt = datetime.datetime.now().isoformat().split('T')[0]
        path = '../projects/' + os.environ['PROJECT'] + '/stats/' + part + '/' + dt + '/' + part + '~' + order + '.json'
        #applyai.log(path, self.logname)
        if os.path.isfile(path):
          noOfBytes = os.path.getsize(path)
          #applyai.log('noOfBytes: ' + str(noOfBytes), self.logname)
          with open(path, 'r') as infile:
            first_line = infile.readline()
            #applyai.log(first_line, self.logname)
            noOfLines = int(noOfBytes / len(first_line))
            #applyai.log('noOfLines: ' + str(noOfLines), self.logname)
            readStart = 0
            readEnd = count * len(first_line)
            if readEnd > noOfBytes:
              readEnd = noOfBytes
            if count < 0:
              readStart = int(noOfBytes + count * len(first_line))
              if readStart < 0:
                readStart = 0
              readEnd = noOfBytes
            #applyai.log('readStart: ' + str(readStart) + ' readEnd: ' + str(readEnd), self.logname)
            if readStart >= 0 and readStart < readEnd:
              infile.seek(readStart, 0)    # move the file pointer forward 6 bytes (i.e. to the 'w')
              j = infile.read(int(math.fabs(count) * len(first_line)))
              j = '{ "total": ' + str(noOfLines) + ',"data": [' + j[:-1].replace('\n',',') + ']}'
              j = json.loads(j)
      return(j)

    @applyai.expose
    @applyai.tools.json_out()
    def getList(self, data='orders', index="0", count="10"):
      j = '{}'
      index = int(index)
      count = int(count)
      path = '../projects/' + self.project + '/stats'
      if not os.path.isdir(path):
        os.makedirs(path)
      path += '/' + data + '.json'
      applyai.log(path, self.logname)
      if os.path.isfile(path):
        noOfBytes = os.path.getsize(path)
        with open(path, 'r') as infile:
          first_line = infile.readline()
          applyai.log(first_line[:-1], self.logname)
          noOfLines = int(noOfBytes / len(first_line))

          readStart = index * len(first_line)
          readEnd = (index + count) * len(first_line)
          if readEnd > noOfBytes:
            readEnd = noOfBytes
            readStart = readEnd - count * len(first_line)
          if readStart < 0:
              readStart = 0
          
          applyai.log('noOfBytes: ' + str(noOfBytes) + ' noOfLines: ' + str(noOfLines) + ' readStart: ' + str(readStart) + ' readEnd: ' + str(readEnd), self.logname)
          if readStart >= 0 and readStart < readEnd:
            infile.seek(readStart, 0)    # move the file pointer forward 6 bytes (i.e. to the 'w')
            j = infile.read(int(math.fabs(count) * len(first_line)))
            j = '{ "total": ' + str(noOfLines) + ',"data": [' + j[:-1].replace('\n',',') + ']}'
            j = json.loads(j)
      return(j)

    # find order by extid
    # OR find first active order
    @applyai.expose
    @applyai.tools.json_out()
    def getOrder(self, extid='0000'):
      j = json.loads('{"id":"0","extid":0,"part":"Test","order":"-","machine":"-","status":1,"fill":".................................................."}')
      extid = int(extid)
      path = '../projects/' + self.project + '/stats'
      if not os.path.isdir(path):
        os.makedirs(path)
      path += '/orders.json'
      applyai.log(path, self.logname)
      if os.path.isfile(path):
        noOfBytes = os.path.getsize(path)
        with open(path, 'r') as infile:
          orders = infile.readlines()
          for o in orders:
            #print(o)
            order = json.loads(o)
            if 'extid' in order:
              if extid == int(order['extid']):
                del order['fill']
                return(order)
            if 'status' in order:
              if order['status'] == 1:
                del order['fill']
                return(order)

      host = self.cfg.store['Project']['visionServer']
      resp = requests.post('http://' + host + '/api/v1/Project/saveListElement?data=orders', json=j).json()
      return(j)

    @applyai.expose
    @applyai.tools.json_in()
    @applyai.tools.json_out()
    def saveListElement(self, data='orders', id="0"):
      j = '{}'
      id = int(id)
      path = '../projects/' + self.project + '/stats'
      if not os.path.isdir(path):
        os.makedirs(path)
      path += '/' + data + '.json'
      applyai.log(path, self.logname)
      if os.path.isfile(path):
        noOfBytes = os.path.getsize(path)
      else:
        os.mknod(path)
        noOfBytes = 0
      with open(path, 'r+') as infile:
        first_line = infile.readline()
        applyai.log(first_line[:-1], self.logname)
        record = applyai.request.json
        if len(first_line) > 0:
          noOfLines = int(noOfBytes / len(first_line))
        else:
          noOfLines = 0
          first_line = str(record)

        print(record)
        print(first_line)
        print(len(first_line))

        writeStart = id * len(first_line)
        if writeStart > noOfBytes:
          writeStart = noOfBytes
          record['id'] = str(noOfLines)
        
        applyai.log('noOfBytes: ' + str(noOfBytes) + ' noOfLines: ' + str(noOfLines) + ' writeStart: ' + str(writeStart), self.logname)
        if writeStart >= 0:
          infile.seek(writeStart, 0)    # move the file pointer forward 6 bytes (i.e. to the 'w')
          record['fill'] = ""
          s = json.dumps(record, ensure_ascii=False).replace(', "',',"').replace(': ',':')
          print(s)
          print(len(s))
          record['fill'] = "." * (len(first_line) - len(s) - 1)
          s = json.dumps(record, ensure_ascii=False).replace(', "',',"').replace(': ',':')
          applyai.log(s, self.logname)
          infile.write(s)
          infile.write('\n')
          return('{"msg":"Success"}')
      return('{"msg":"Error"}')

    @applyai.expose
    @applyai.tools.json_in()
    @applyai.tools.json_out()
    def activateListElement(self, data='orders', id="0"):
      path = '../projects/' + self.project + '/stats/' + data + '.json'
      applyai.log(path, self.logname)
      with open(path, 'r+') as infile:
        posStart = infile.tell()
        line = infile.readline()
        posEnd = infile.tell()
        while line:
          record = json.loads(line)
          if record['status'] == 1 or record['id'] == id:
            record['status'] = 0
            if record['id'] == id:
              record['status'] = 1
            record['fill'] = ''
            infile.seek(posStart, 0)
            s = json.dumps(record, ensure_ascii=False).replace(', "',',"').replace(': ',':')
            record['fill'] = "." * (len(line) - len(s) - 1)
            s = json.dumps(record, ensure_ascii=False).replace(', "',',"').replace(': ',':')
            infile.write(s)
            infile.seek(posEnd, 0)

          posStart = infile.tell()
          line = infile.readline()
          posEnd = infile.tell()

      return('{"msg":"Success"}')

    @applyai.expose
    @applyai.tools.json_in()
    @applyai.tools.json_out()
    def deleteListElement(self, data='orders', id="0"):
      j = '{}'
      id = int(id)
      path = '../projects/' + self.project + '/stats/' + data + '.json'
      applyai.log(path, self.logname)
      noOfBytes = os.path.getsize(path)
      with open(path, 'r+') as infile:
        first_line = infile.readline()
        applyai.log(first_line[:-1], self.logname)
        noOfLines = int(noOfBytes / len(first_line))

        delStart = id * len(first_line)
        applyai.log('noOfBytes: ' + str(noOfBytes) + ' noOfLines: ' + str(noOfLines) + ' delStart: ' + str(delStart) + ' len(first_line): ' + str(len(first_line)), self.logname)
        infile.seek(delStart, 0)    # move the file pointer forward 6 bytes (i.e. to the 'w')
        d = infile.read(len(first_line))
        j = json.loads(d)
        id = int(j["id"])
        while delStart < noOfBytes - len(first_line): # TODO this will not delete the last line of the orders list
          print(delStart)
          infile.seek(delStart + len(first_line), 0)    # move the file pointer forward 6 bytes (i.e. to the 'w')
          d = infile.read(len(first_line))
          print(d)
          record = json.loads(d)
          record["id"] = str(id)
          id += 1
          record["fill"] = ""
          s = json.dumps(record, ensure_ascii=False).replace(', "',',"').replace(': ',':')
          record['fill'] = "." * (len(first_line) - len(s) - 1)
          s = json.dumps(record, ensure_ascii=False).replace(', "',',"').replace(': ',':')
          applyai.log(s, self.logname)
          infile.seek(delStart, 0)
          infile.write(s)
          delStart += len(first_line)
          if delStart >= noOfBytes - len(first_line):
            infile.seek(noOfBytes - len(first_line), 0)    # move the file pointer forward 6 bytes (i.e. to the 'w')
            infile.truncate()
        
        return('{"msg":"Success"}')

      return('{"msg":"Error"}')

    @applyai.expose
    def getStlFile(self, filename):
      path = '../common/stl/'
      with open(path + filename, 'rb') as infile:
        stl = infile.read()

      applyai.response.headers['Content-Type'] = "model/stl"
      return(stl)

    @applyai.expose
    @applyai.tools.json_out()
    def sendCmd(self, CMD = 'detect'):
      applyai.log('in sendCMD ' + CMD, self.logname)
      # self.targets.reset() # this is pointless here as 
      if self.cfg.store['System']['nodeRed'] == True:
        # use NodeRed for more complicated sequences
        try:
          resp  = requests.get('http://127.0.0.1:1880/sendCMD?CMD=' + CMD).json()
        except:
          applyai.log('$Error: NodeRed not available on port 1880', self.logname)
          resp = {}
      else:
        host = self.cfg.store['Project']['visionServer']
        # applyai.engine.publish('Part/base',{})
        # Simple sequential program - no NodeRed required 
        resp = {"sequence": "detect"}
        for p in self.cfg.store[self.name]['plugins']:
          applyai.log('post start', self.logname)
          applyai.response.headers['Content-Type'] = "application/json"
          resp = requests.post('http://' + host + '/api/v1/' + p['name'] + '/start', json=resp).json()
          applyai.log('post finished', self.logname)
        #self.flushImages()
      self.lastParamsResp = resp
      return resp

    @applyai.expose
    @applyai.tools.json_out()
    def getLastParams(self):
      applyai.log('in getLastParams', self.logname)
      return self.lastParamsResp

    @applyai.expose
    @applyai.tools.json_out()
    def getProject(self, project):
      return(self.cfg.store[self.name])

    @applyai.expose
    @applyai.tools.json_in()
    @applyai.tools.json_out()
    def saveProject(self, project):
      cfgFilename = '../projects/' + project + '/config/Project.conf'
      # TODO All file operations should send a message to the GUI
      return({'info':'updated cfg ' + cfgFilename})

    def flushImages(self):
       # when the process is finished save the images for analysis
       applyai.log('flushing images to disk for analysis', self.logname)
       for p in self.cfg.store[self.name]['plugins']:
         frameOutFile = str('../common/images/%s_%s_%02d.jpg' % (self.project, p['name'], 0))
         # applyai.log('writing: ' + frameOutFile, self.logname)
         cv2.imwrite(frameOutFile, self.store.fetchFrameOut(p['name'],0))

    #Converts the input JSON to a DataFrame
    def convertToDF(self,dfJSON):
        return(json_normalize(dfJSON))

    #Converts the input DataFrame to JSON 
    def convertToJSON(self, df):
        resultJSON = df.to_json(orient='records')
        return(resultJSON)

    @applyai.expose
    @applyai.tools.json_out()
    def setRunningMode(self, runningMode):
      self.setCfgVal('runningMode', int(runningMode))
      return({'info':'updated runningMode: ' + runningMode})

    @applyai.expose
    @applyai.tools.json_out()
    def getRunningMode(self):
      mode = self.getCfgVal('runningMode')
      return({'runningMode': mode})

    @applyai.expose
    @applyai.tools.json_out()
    def listFiles(self, path):
      allFiles = []
      mainPath = '../projects/' + os.environ['PROJECT'] + '/' + path
      os.path.basename(mainPath)
      if os.path.isdir(mainPath):
        allFiles = sorted(glob.glob(mainPath + '/*.jpg'))
        sorted(allFiles, reverse=False)
        for idx, p in enumerate(allFiles):
          allFiles[idx] = os.path.basename(p)

      res = {}
      res['total'] = len(allFiles)
      res['list'] = allFiles
      return(res)

    @applyai.expose
    def getImage(self, path):
      frame = cv2.imread(path) #cameraFeed.cam)
      img = cv2.imencode('.jpg', frame)[1].tobytes()
      applyai.response.headers['Content-Type']= 'multipart/x-mixed-replace; boundary=frame'
      return (b'--frame\r\n'
              b'Content-Type: image/jpeg\r\n\r\n' + img + b'\r\n')

    @applyai.expose
    @applyai.tools.json_out()
    def setActiveImage(self, imgName):
      src = '../projects/' + os.environ['PROJECT'] + '/images/testImages/' + imgName 
      target = '../projects/' + os.environ['PROJECT'] + '/images/frame_000_00.jpg'
      print(src)
      print(target)
      copyfile(src, target)
      return({'status': 'ok'})

    @applyai.expose
    @applyai.tools.json_in()
    @applyai.tools.json_out()
    def saveReferenceImage(self):

      data = applyai.request.json
      applyai.log(str(data), self.logname)

      plugin = data['plugin']
      part   = data['part']
      roiNickname = data['roiNickname']
      frame = self.store.fetchFrameOut(plugin,0)
      x = int(data['x'])
      y = int(data['y'])
      w = int(data['w'])
      h = int(data['h'])
      a = int(data['angle'])
      box = cv2.boxPoints(((x,y),(w,h),a))
      #print(box)
      mi = np.amin(box, axis=0)
      ma = np.amax(box, axis=0)
      x = int(mi[0])
      y = int(mi[1])
      w = int(ma[0])-x
      h = int(ma[1])-y
      muster = frame[y:y+h, x:x+w]
      referenceFile ='../projects/' + os.environ['PROJECT'] + '/parts/MatchRef~' + part + '~' + roiNickname + '.1.jpg'
      applyai.log('writing: ' + referenceFile, self.logname)
      cv2.imwrite(referenceFile, muster)
      return({'status': 'ok'})

  class PCode(stdPCode):
    
    def __init__(self, name='Project'):
      stdPCode.__init__(self, name)
      #self.client = mqtt.Client()
      #self.client.on_connect = self.on_connect
      #self.client.connect("127.0.0.1", 1883, 60)
      #self.client.loop_start()
      #self.counter = 0
      #self.interval = 1
      #self.job = applyai_job.Job(interval=timedelta(seconds=self.interval), execute=self.updateStatus)
      #self.job.start()

    #def updateStatus(self):
    #  self.counter += 1
    #  self.client.publish('watchdog/visionServer', self.counter)

    #def stop(self):
    #  '''Called when the engine stops'''
    #  if self.client != None:
    #    self.client.loop_stop(force=False)
    #    self.client.disconnect()
    #  applyai.log('Stopping ' + self.logname, self.logname)

    #def on_connect(self, client, userdata, flags, rc):
    #  applyai.log("Connected with result code "+str(rc), self.logname)

    #  # Subscribing in on_connect() means that if we lose the connection and
    #  # reconnect then subscriptions will be renewed.
    #  client.subscribe("$SYS/#")

