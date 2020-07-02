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
import cherrypy as applyai
from os import environ
import json

class readme:

  def __init__(self, name, language='EN'):
    self.name = name
    self.description = ''
    self.variables = ''
    self.returns = ''
    self.language = language
    self.readReadme()
    self.extractInfo()

  def getPath(self):
    path = './stdPlugins/' + self.name + '/README.md'
    if self.language == 'DE' or self.language == 'de':
      path = './stdPlugins/' + self.name + '/README_DE.md'
    return(path)

  def readReadme(self):
    path = self.getPath()
    if os.path.isfile(path):
      with open(path, 'r') as infile:
        self.mdContents = infile.read()
    else:
      self.mdContents = 'ERROR - ' + self.getPath()
      applyai.log('$Error - ' + self.getPath(), self.name)
      
  def extractInfo(self):
    partial = self.mdContents.split('## ')
    if len(partial) > 1:
      #print(partial[1])
      self.description = partial[1].replace('\n','<br><br>',1).replace('\n','<br>')
    else:
      self.description = 'ERROR - ## Description format fault'
      applyai.log('$Error - ## Description format fault', self.name)
    if len(partial) > 2:
      self.variables = partial[2].replace('\n','<br><ul>',1).replace('- ','<li>').replace('\n','</li>')
      self.variables = self.variables + '</ul>'
    else:
      self.variables = 'ERROR - ## Variables format fault'
      applyai.log('$Error - ## Variables format fault', self.name)
    if len(partial) > 3:
      self.returns = partial[3].replace('\n','<br><ul>',1).replace('- ','<li>').replace('\n','</li>')
      self.returns = self.returns + '</ul>'
    else:
      self.variables = 'ERROR - ## Returns format fault'
      applyai.log('$Error - ## Returns format fault', self.name)

  def print(self):
    #print(self.mdContents)
    print(self.description)
    print(self.variables)
    print(self.returns)

if __name__ == "__main__":
  
  plugin  = 'Camera'
  readme = readme(plugin)
  readme.print()
