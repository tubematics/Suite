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
import importlib.machinery as loader
import time
import sys
import os
from os import environ
import glob
import cv2
import json
import logging
import warnings

import applyai_vision.logfiles as logfiles
import applyai_vision.plugin as plugin
from cherrypy.process.plugins import Autoreloader

import pluginSystem
import pluginProject

if not sys.warnoptions:
  warnings.filterwarnings("ignore", category=FutureWarning)

def load_project_from_file(filepath):

  mod_name,file_ext = os.path.splitext(os.path.split(filepath)[-1])

  if file_ext.lower() == '.py':
      #py_mod = imp.load_source(mod_name, filepath)
      py_mod = loader.SourceFileLoader(mod_name, filepath).load_module()
  elif file_ext.lower() == '.pyc':
      #py_mod = imp.load_compiled(mod_name, filepath)
      py_mod = loader.SourcelessFileLoader(mod_name, filepath).load_module()

  return py_mod

class Root(object):
  @applyai.expose
  def dummy(self):
    applyai.log('this REALLY NEVER is called','Root')
    #f = open('../roboGUI/dist/index.html', "r")
    #html = f.read()
    #f.close()
    return html

def main():

  applyai.log.error_log.propagate = False
  applyai.log.access_log.propagate = False

  logPath = '../projects/' + os.environ['PROJECT'] + '/logs'
  if not os.path.isdir(logPath):
    os.mkdir(logPath)
  
  partsPath = '../projects/' + os.environ['PROJECT'] + '/parts'
  if not os.path.isdir(partsPath):
    os.mkdir(partsPath)
  
  statsPath = '../projects/' + os.environ['PROJECT'] + '/stats'
  if not os.path.isdir(statsPath):
    os.mkdir(statsPath)
  
  imgPath = '../projects/' + os.environ['PROJECT'] + '/images'
  if not os.path.isdir(imgPath):
    os.mkdir(imgPath)
  
  globalConfig = {
    'server.socket_host': '0.0.0.0',
    'server.socket_port': int(os.environ['PORT']),
    # CORS POLICY
    'tools.response_headers.on': True,
    'tools.response_headers.headers': [('Content-Type', 'image/jpeg'), ('Access-Control-Allow-Origin', 'http://127.0.0.1')],
    # End of CORS
    'log.screen': True,
    'log.access_file': logPath + '/access.log',
    'log.error_file': logPath + '/error.log'
  }

  # configure the server
  applyai.config.update(globalConfig)

  cwd = os.getcwd()
  appConfig = {'/':
      {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': cwd + "/../roboGUI/dist",
        'tools.staticdir.index': "index.html"
      },
      '/images':{
        'tools.staticdir.on': True,
        'tools.staticdir.dir': cwd + "/../projects/" + os.environ['PROJECT'] + "/images"
      },
      '/partDetails':{
        'tools.staticdir.on': True,
        'tools.staticdir.dir': cwd + "/../projects/" + os.environ['PROJECT'] + "/stats"
      }
    }
  # configure the core vue applications
  application = applyai.tree.mount(Root(), config = appConfig)

  ha = logging.handlers.RotatingFileHandler(logPath + '/access.log', 'a', 100000, 100)
  he = logging.handlers.RotatingFileHandler(logPath + '/error.log', 'a', 100000, 100)

  application.log.error_log.addHandler(he)
  application.log.access_log.addHandler(ha)

  # ----------------------------------------------------------------
  # start the standard plugins System, Project, Logs
  # ----------------------------------------------------------------
  logfiles.LogfilePlugin(applyai.engine).subscribe()

  systemConfigFile = './sysConfig/System.conf'
  with open(systemConfigFile) as json_file:
    sconf = json.load(json_file)

  #applyai.engine.autoreload.files.add(systemConfigFile)
  applyai.tree.mount(pluginSystem.applyaiPlugin.API(), '/api/v1/System', {'/':{}})
  plugin.Plugin(applyai.engine, pluginSystem.applyaiPlugin.PCode).subscribe()

  applyai.engine.autoreload.files.add('./sysConfig/Texts.conf')

  #jsonFiles = glob.glob('../common/parts/*.json')
  #for jfile in jsonFiles:
  #  applyai.engine.autoreload.files.add(jfile)

  # load standard applications like configs and logfiles
  applyai.tree.mount(logfiles.Logs(), '/api/v1/logfiles','./sysConfig/logfiles.conf')
  
  projectConfigFile = '../projects/' + os.environ['PROJECT'] + '/config/Project.conf'
  with open(projectConfigFile) as json_file:
    pconf = json.load(json_file)

  if pconf['projectName'] != os.environ['PROJECT']:
    print('Project installation corrupted - project name not equal to environment variable PROJECT')
    print(pconf['projectName'], os.environ['PROJECT'])
    exit(-1)

  applyai.engine.autoreload.files.add(projectConfigFile)
  applyai.tree.mount(pluginProject.applyaiPlugin.API(), '/api/v1/Project', {'/':{}})

  #plugin.Plugin(applyai.engine, pluginProject.applyaiPlugin.PCode).subscribe()
  # ----------------------------------------------------------------
  # collect all plugin files from the project
  # there has to be a pluginProject.py file as this is the root
  # ----------------------------------------------------------------
  path = '../projects/' + pconf['projectName'] + '/code/'
  projectFiles = glob.glob(path + 'plugin*.py')
  # ----------------------------------------------------------------
  # start the project APIs - there must be at least one!
  # start the project plugins
  # ----------------------------------------------------------------
  fault = 0
  for pin in pconf['plugins']:
    # check for deefault.conf
    defaultCfg = './stdPlugins/' + pin['name'] + '/default.conf'
    if not os.path.isfile(defaultCfg):
      fault = 5
      break

    targetFile = 'plugin' + pin['name'] + '.py'
    targetPath = '../projects/' + pconf['projectName'] + '/code/' + pin['name'] + '/' + targetFile
    if os.path.isfile(targetPath):
      p = load_project_from_file(targetPath)
      if hasattr(p, 'applyaiPlugin'):
        conf = {'/':{}}
        if hasattr(p.applyaiPlugin, 'API'):
          applyai.tree.mount(p.applyaiPlugin.API(), '/api/v1/' + pin['name'], conf)
        else:
          fault = 1
          break
        if hasattr(p.applyaiPlugin, 'PCode'):
          plugin.Plugin(applyai.engine, p.applyaiPlugin.PCode).subscribe()
        else:
          fault = 2
          break
      else:
        fault = 3
        break
    else:
      targetPath = './stdPlugins/' + pin['name'] + '/' + targetFile
      if os.path.isfile(targetPath):
        p = load_project_from_file(targetPath)
        if hasattr(p, 'applyaiPlugin'):
          conf = {'/':{}}
          if hasattr(p.applyaiPlugin, 'API'):
            applyai.tree.mount(p.applyaiPlugin.API(), '/api/v1/' + pin['name'], conf)
          else:
            fault = 1
            break
          if hasattr(p.applyaiPlugin, 'PCode'):
            plugin.Plugin(applyai.engine, p.applyaiPlugin.PCode).subscribe()
            if pin['name'] == 'Part':
              plugin.Plugin(applyai.engine, p.applyaiPlugin.API).subscribe()
          else:
            fault = 2
            break
        else:
          fault = 3
          break
      else:
        fault = 4
        break

  if fault > 0:
    applyai.engine.exit()
    time.sleep(1)
    print('---------------------------------------------')
    print('Severe ERROR - applyai Server startup failure')
    print('---------------------------------------------')
    if fault == 1:
      print('Plugin ' + targetPath + ' does not have class API')
    elif fault == 2:
      print('Plugin ' + targetPath + ' does not have class PCode')
    elif fault == 3:
      print('Plugin ' + targetPath + ' does not have class applyaiPlugin')
    elif fault == 5:
      print('file ' + defaultCfg + ' missing - application exiting!')
    else:
      print('Plugin ' + targetPath + ' does not exist')
    print('---------------------------------------------')
    return

  # ----------------------------------------------------------------
  # start the engine!
  # ----------------------------------------------------------------
  applyai.engine.start()
  applyai.engine.publish('System/updateLanguage',{})

  # ----------------------------------------------------------------
  # start the autostart plugins
  # ----------------------------------------------------------------
  print('applyai Vision started project [' + pconf['projectName'] + ']')
  applyai.log('$Info - started project [' + pconf['projectName'] + ']', 'SYSTEM')
  for p in pconf['autostartplugins']:
    topic = p + '/start'
    applyai.engine.publish(topic,{})

  applyai.engine.block()

if __name__ == '__main__':

  print(sys.argv)
  debug = False
  if not debug:
    if len(sys.argv) < 2:
      print('Parameter <Project name> missing')
      exit(-1)

    if len(sys.argv) < 3:
      print('Parameter <Port> missing')
      exit(-1)

    projectName = sys.argv[1]
    projectPort = sys.argv[2]
  else:
    projectName = "Inovan"
    projectPort = "5000"

  os.environ["PROJECT"] = projectName
  os.environ["PORT"] = projectPort

  if not os.path.isdir('../projects/' + projectName):
    print('Project configuration missing - please create: ' + '../projects/' + projectName)
    exit(-1)

  main()

  print('applyai Vision shutdown completed')
