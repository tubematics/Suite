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
import requests
import json
import os
import cv2
import datetime
import sys
import base64
import numpy as np
from PIL import Image

from datetime import timedelta
#from pandas.io.json import json_normalize

from applyai_vision.scheduler import Schedule
from applyai_vision.imgStore import imgStore
from applyai_vision.cfgStore import cfgStore
from applyai_vision.readme import readme
from applyai_vision.targets import Targets

class stdAPI:

  def __init__(self, name):
    self.logname = name[:6].upper().ljust(6)
    self.name = name
    self.store = imgStore(name)
    self.targets = Targets()
    self.cfg = cfgStore(name)
    language = self.cfg.store['System']['language']
    self.readme = readme(name, language)
    self.project = os.environ['PROJECT']
    applyai.log('init API',self.logname)
    #TODO Add runningMode to cfg store

  def getCfgVal(self, variable):
    return self.cfg.getCfgVal(self.name,variable)

  def setCfgVal(self, variable, value):
    return self.cfg.setCfgVal(self.name,variable, value)

  def color(self, colstr):
    if 'colors' in self.cfg.store['System']:
      if colstr in self.cfg.store['System']['colors']:
        c = self.cfg.store['System']['colors'][colstr]
        return(c)
    return(0,0,0)

  def colorIndex(self, idx):
    if 'colors' in self.cfg.store['System']:
      if idx >= 0 and idx < len(self.cfg.store['System']['cindex']):
        c = self.cfg.store['System']['cindex'][idx]
        return(c)
    return(0,0,0)

  #Converts the input JSON to a DataFrame
  #def convertToDF(self,dfJSON):
  #    return(json_normalize(dfJSON))

  #Converts the input DataFrame to JSON 
  def convertToJSON(self, df):
      resultJSON = df.to_json(orient='records')
      return(resultJSON)

  @applyai.expose
  @applyai.tools.json_in()
  @applyai.tools.json_out()
  def start(self): #, sequence='detect', frameIn='', channel=0, targets="[]"):

    start = datetime.datetime.now()
    applyai.log('$Start@0', self.name)

    params = applyai.request.json
    if 'extid' not in params:
      params['extid'] = '0000'
    
    # check if this is the FIRST plugin in the sequence
    project = self.cfg.getConfig('Project')
    if project['plugins'][0]['name'] == self.name:
      self.targets.reset()
      vSvr = self.cfg.store['Project']['visionServer']
      params['order'] = requests.get("http://" + vSvr + "/api/v1/Project/getOrder?extid=" + params['extid']).json()
      part = params['order']['part']
      # TODO version is fixed to 1 here but the latest plan is always loaded
      params['plan'] = requests.get("http://" + vSvr + "/api/v1/Project/getPart?number=" + part + '&version=1').json()
      applyai.log(str(params['order']), self.logname)

    # update the frame in from the previous frameout
    if 'name' in params:
      self.store.updateFrameIn(self.name, 0, self.store.fetchFrameOut(params['name'],0))

    params['name'] = self.name             # always overwrite this
    if 'sequence' not in params:          # default sequence detect
      params['sequence'] = 'detect'

    # params are passed through main
    params = self.main(params)

    done = datetime.datetime.now()
    applyai.log('$Finished@%0.0f' % float((done-start).total_seconds() * 1000), self.name)
    return params

  @applyai.expose
  def getFrame(self, frame, camera=0, rand=0):
    # applyai.log('getFrame ' + str(frame) + '|' + str(camera), self.logname)
    camera = int(camera)
    if frame == 'in':
      return(self.getFrameIn(camera, rand))
    else:
      return(self.getFrameOut(camera, rand))

  @applyai.expose
  def getFrameIn(self, camera=0, rand=0):
    applyai.response.headers['Content-Type'] = "image/jpg"
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 100]
    frame = self.store.fetchFrameIn(self.name, camera)
    #print(type(frame))
    jpgStr = cv2.imencode('.jpg', frame, encode_param)
    #print(type(jpgStr))
    ret = jpgStr[1].tobytes()
    #print(type(ret))
    return ret

  @applyai.expose
  def getFrameOut(self, camera=0, rand=0):
    applyai.response.headers['Content-Type'] = "image/jpg"
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 30]
    # resize here ?
    return cv2.imencode('.jpg', self.store.fetchFrameOut(self.name, camera), encode_param)[1].tobytes()

  @applyai.expose
  @applyai.tools.json_out()
  def upload(self, ufile):

    data = ufile.file.read()
    size = len(data)
    img = cv2.imdecode(np.fromstring(data, np.uint8), cv2.IMREAD_UNCHANGED)
    self.store.updateFrameIn(self.name, 0, img)

    out = {}
    out['msg'] = 'File received',
    out['filename'] = ufile.filename,
    out['length'] = size,
    return out

  @applyai.expose
  @applyai.tools.json_out()
  def getTargets(self):
    applyai.response.headers['Content-Type'] = "application/json"
    #jstr = '{"targets":' + self.store.fetchTargets(self.name).to_json(orient='records') + '}'
    return self.targets.fetch() #.to_json(orient='records')

  @applyai.expose
  @applyai.tools.json_out()
  def getConfig(self):
    return(self.cfg.getConfig(self.name))

  @applyai.expose
  @applyai.tools.json_in()
  @applyai.tools.json_out()
  def saveConfig(self):
    cfg = applyai.request.json
    self.cfg.updateConfig(self.name,cfg)
    return({'info':'updated cfg ' + self.cfg.getConfigPath(self.name)})
    
  @applyai.expose
  @applyai.tools.json_out()
  def getReadme(self):
    info = {}
    info['description'] = self.readme.description
    info['variables'] = self.readme.variables
    info['returns'] = self.readme.returns
    return(info)

  @applyai.expose
  @applyai.tools.json_in()
  @applyai.tools.json_out()
  def getPixelInfo(self): #Pass pixel position xy returns rgb and hsv values
    data = applyai.request.json
    frame = self.store.fetchFrameOut(self.name, 0)
    print(frame.shape)
    #hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    print(data)
    y_co = data['y']
    if y_co < 1:
      y_co = 1
    if y_co > frame.shape[0]-1:
      y_co = frame.shape[0]-1
    x_co = data['x']
    if x_co < 1:
      x_co = 1
    if x_co > frame.shape[1]-1:
      x_co = frame.shape[1]-1
    print(y_co, x_co)
    r = 0
    g = 0
    b = 0
    cc = 0

    for xx in range(-1,2):
      for yy in range(-1,2):
        bgr = frame[y_co+yy, x_co+xx]
        b += bgr[0]
        g += bgr[1]
        r += bgr[2]
        cc += 1

    r = int(r/cc)
    g = int(g/cc)
    b = int(b/cc)
    print(cc,r,g,b)
    h, s, v = self.rgb2hsv(r, g, b)
    print(h,s,v)
    return {'r': str(r), 'g': str(g), 'b': str(b), 'h': str(h), 's': str(s), 'v': str(v)}

  def rgb2hsv(self, r, g, b):
    r, g, b = r/255.0, g/255.0, b/255.0
    mx = max(r, g, b)
    mn = min(r, g, b)
    df = mx-mn
    if mx == mn:
        h = 0
    elif mx == r:
        h = (60 * ((g-b)/df) + 360) % 360
    elif mx == g:
        h = (60 * ((b-r)/df) + 120) % 360
    elif mx == b:
        h = (60 * ((r-g)/df) + 240) % 360
    if mx == 0:
        s = 0
    else:
        s = df/mx
    v = mx
    return h, s, v

  @applyai.expose
  @applyai.tools.json_in()
  @applyai.tools.json_out()
  def saveReferenceImage(self, filename):

    filename = 'MatchRef~' + self.name + '~ROI_1.jpg'
    filename = 'MatchRef~4711~ROI_5.1.jpg'

    data = applyai.request.json
    frame = self.store.fetchFrameOut(self.name, 0)
    print(frame.shape)
    print(data)
    x = data['x']
    y = data['y']
    w = data['w']
    h = data['h']
    img = frame[y:y+h, x:x+w]

    path = '../projects/' + os.environ['PROJECT'] + '/parts/' + filename

    cv2.imwrite(path, img)
    return {'msg': 'saved'}

  @applyai.expose
  def index(self):
    html = self.html_header()
    html += '<body onload="init()">'
    html += '<section class="section">'
    html += '<div class="container">'
    #html += self.html_name()
    html += '<hr>'
    #html += self.html_config()
    html += '<hr>'
    #html += self.html_frames()
    html += '<hr>'
    #html += self.html_buttons()
    html += '</section></div></body></html>'
    return(html.encode('utf8'))

  def html_header(self):
    html = '<!DOCTYPE html><html>\n'
    html += '<head>\n'
    html += '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">\n'
    html += '<title>applyai Plugin Tester</title>\n'
    html += '<style>body {font-family:arial;}</style>\n'
    html += '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css"/>\n'
    html += self.getJS()
    html += '</head>\n'
    return(html)

  def getJS(self):
    js = '<script type="text/javascript">\n'
    js += 'function init() {\n'
    js += '}\n'
    js += 'function startTest() {\n'
    js += '  var params = {}\n'
    js += '  post("/' + self.name + '/start", params, function() {\n'
    js += '    document.getElementById("frameOut").src = "/' + self.name + '/getFrameOut?camera=0&rand=" + Math.random()\n'
    js += '  })\n'
    js += '}\n'
    js += 'function get(what, next) {\n'
    js += '  xhr = new XMLHttpRequest()\n'
    js += '  xhr.open("GET", what)\n'
    js += '  xhr.onload = function() {\n'
    js += '   if (xhr.status === 200) {\n'
    js += '     console.log(xhr.responseText)\n'
    js += '     next()\n'
    js += '   } else {\n'
    js += '     alert("Request failed.  Returned status of " + xhr.status)\n'
    js += '   }\n'
    js += '  }\n'
    js += '  xhr.send()\n'
    js += '}\n'
    js += 'function post(url, msg, next) {\n'
    js += '  xhr = new XMLHttpRequest()\n'
    js += '  xhr.open("POST", url, true)\n'
    js += '  xhr.setRequestHeader("Content-Type", "application/json")\n'
    js += '  xhr.onload = function() {\n'
    js += '   if (xhr.status === 200) {\n'
    js += '     console.log(xhr.responseText)\n'
    js += '     next()\n'
    js += '   } else {\n'
    js += '     alert("Request failed.  Returned status of " + xhr.status)\n'
    js += '   }\n'
    js += '  }\n'
    js += '  xhr.send(JSON.stringify(msg))\n'
    js += '}\n'
    js += '</script>\n'
    return(js)

  def html_name(self):
    html =  '<div><h2 class="title">applyai Plugin Tester</h2></div>\n'
    html += '<div><h2 class="title">Plugin: ' + self.name + '</h2></div>\n'
    return(html)

  def html_config(self):
    cfg = self.getConfig()
    html = '<div>\n'
    html += 'Description of Plugin: ' + self.readme.description
    html += '</div>\n'
    return(html)

  def html_frames(self):
    html = '<div class="columns">\n'
    html += '<div class="column is-6"><figure class="image is-4by3">\n'
    html += '<img id="frameIn" src="/' + self.name + '/getFrameIn">\n'
    html += '</figure></div>\n'
    html += '<hr>\n'
    html += '<div class="column is-6"><figure class="image is-4by3">\n'
    html += '<img id="frameOut" src="/' + self.name + '/getFrameOut">\n'
    html += '</figure></div></div>\n'
    return(html)

  def html_buttons(self):
    html = '<div>\n'
    html += '<button class="button is-primary" onclick="startTest()">Test</button>\n'
    html += '</div>\n'
    return(html)


class stdPCode:
  
  def __init__(self, name):

    self.logname = name[:6].upper().ljust(6)
    self.name = name
    self.project = os.environ['PROJECT']
    self.store = imgStore(name)
    self.cfg = cfgStore(name)
    applyai.log('init PCode',self.logname)

  def getCfgVal(self, variable):
    return self.cfg.getCfgVal(self.name,variable)

  def setCfgVal(self, variable, value):
    return self.cfg.setCfgVal(self.name,variable, value)

  def stop(self):
    applyai.log('Stopping plugin', self.logname)


