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
import os
from os import environ
import json
import sys

sys.path.insert(0,"./applyai_vision")
from colors import Colors
#from googletrans import Translator

class cfgStore:

  store = {}

  def __init__(self, name):
    self.add(name)

  def add(self, name):
    if name not in cfgStore.store:
      cfgStore.store[name] = {}
      cfgStore.store[name] = self.loadConfigFromFile(name)

      default = self.loadConfigFromFile(name, True)
      for d in default:
        if d not in cfgStore.store[name]:
          cfgStore.store[name][d] = default[d]

      if name not in ['System','Project','Camera','Flir','Capture']:
        if 'frameIn' not in cfgStore.store[name]:
          # store the dict and then insert the new vars at the top of the list
          temp = cfgStore.store[name]
          cfgStore.store[name] = {}
          self.insertConfigVariable(name,1,"Text","frameIn","default","","Frame source","","default~Mask~Color~Noise~FillGap")
          self.insertConfigVariable(name,1,"Number","channel","0","","Source channel","")
          for t in temp:
            cfgStore.store[name][t] = temp[t]

      if name in ['System']:
        if 'colors' not in cfgStore.store[name]:
          cfgStore.store[name]['colors'] = Colors().list
        if 'cindex' not in cfgStore.store[name]:
          cfgStore.store[name]['cindex'] = Colors().index

      self.saveConfigToFile(name)
      # after save to file - only change in memory
      # add the port here just in case we are serving multiple vision applications
      if name == 'Project':
        cfgStore.store[name]['visionServer'] = cfgStore.store[name]['visionServer'] + ':' + os.environ['PORT']
      

  def insertConfigVariable(self, name, typ, valueType, var, defaultValue, units, guiText, guiLongText, select=""):
    newvar = {}
    newvar['type'] = typ
    newvar['valueType'] = valueType
    newvar['value'] = defaultValue
    newvar['units'] = units
    newvar['guiText'] = guiText
    newvar['guiLongText'] = guiLongText
    newvar['select'] = select
    cfgStore.store[name][var] = newvar

  # ----------------------------------------------------------- TEXT MANAGEMENT
  def getLanguageIndex(self):
    if cfgStore.store['System']['language'] == 'DE':
      return(1)
    return(0) # Default language is EN

  def insertTextIntoSystemConf(self, name, var, langIdx):
    if name in cfgStore.store:
      if var in cfgStore.store[name]:
        if name not in cfgStore.store['System']['text']['var']:
          cfgStore.store['System']['text']['var'][name] = {}
        if var not in cfgStore.store['System']['text']['var'][name]:
          cfgStore.store['System']['text']['var'][name][var] = []
          guiText = cfgStore.store[name][var]['guiText']
          cfgStore.store['System']['text']['var'][name][var].append(guiText)
          deText = '' #Translator().translate(guiText, dest='de')
          cfgStore.store['System']['text']['var'][name][var].append(deText.text)
          return(cfgStore.store['System']['text']['var'][name][var][langIdx])
    return('var/plugin missing from System.conf')

  # function called after all plugins have started
  # It replaces text with selected language text
  def updateLanguage(self, name):
    langIdx = self.getLanguageIndex()
    if name not in ['System']:
      if name in cfgStore.store:
        for c in cfgStore.store[name]:
          if 'guiText' in cfgStore.store[name][c]:
            try:
              txt = cfgStore.store['System']['text']['var'][name][c][langIdx]
            except:
              txt = 'missing text' #self.insertTextIntoSystemConf(name, c, langIdx)

            cfgStore.store[name][c]['guiText'] = txt
      self.saveConfigToFile('System')

  # ----------------------------------------------------------- TEXT MANAGEMENT

  def updateConfig(self, name, cfg):
    if name in cfgStore.store:
      cfgStore.store[name] = cfg
    else:
      self.add(name)
      cfgStore.store[name] = cfg
    self.saveConfigToFile(name)

  def saveConfigToFile(self, name):
    with open(self.getConfigPath(name), 'w') as outfile:
      outfile.write(json.dumps(cfgStore.store[name], indent=2, ensure_ascii=False))

  def getConfigPath(self, name):
    path = '../projects/' + environ.get('PROJECT') + '/config/' + name + '.conf'
    if name == 'System':
      path = './sysConfig/' + name + '.conf'
    return path

  def loadConfigFromFile(self, name, default=False):
    cfg = {}
    if default:
      path = './stdPlugins/' + name + '/default.conf'
    else:
      path = self.getConfigPath(name)
    if os.path.isfile(path):
      with open(path, 'r') as infile:
        jstr = infile.read()
    else:
      jstr = "{}"
    cfg = json.loads(jstr)
    return(cfg)
  
  def getConfig(self, name):
    return cfgStore.store[name]

  def getCfgVal(self, name, variable):
    val = ""
    if name in cfgStore.store:
      if variable in cfgStore.store[name]:
        val = cfgStore.store[name][variable]['value']
    return val

  def setCfgVal(self, name, variable, value): #TODO test for plugins array
    if name in cfgStore.store:
      if variable in cfgStore.store[name]:
        cfgStore.store[name][variable]['value'] = value
        return True
    return False

  def print(self, name):
    if name in cfgStore.store:
      print(cfgStore.store[name])

  def printAll(self):
    for c in cfgStore.store:
      print(cfgStore.store[c])

if __name__ == "__main__":
  
  plugin  = 'Camera'
  cfg = cfgStore(plugin)
  cfg.print('Camera')
  print(cfg.store['Camera']['xRes'])
