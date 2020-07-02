def grabAPI(filename):
  count = 0
  mode = 0
  typ = 'GET '
  with open(filename, 'r') as code:
    while True:
      line = code.readline()
      if not line:
        break
      if mode == 0 and line.find('@applyai.expose') >= 0:
        count += 1
        #print('--------------------------- ' + str(count))
        mode = 1
        typ = 'GET '
      if mode == 1 and line.find('@applyai.tools') >= 0:
        if line.split('.')[2].find('json_in') >= 0:
          typ = 'POST '
        #if line.split('.')[2].find('json_out') >= 0:
        #  typ = 'GET '
      if mode == 1 and line.find('def ') >= 0:
        bereich = 'Plugin'
        if filename.find('pluginProject') > 0:
          bereich = 'Project'
        if filename.find('pluginSystem') > 0:
          bereich = 'System'
        fn = line[:-1].strip().replace('def ','').split('(')
        params = fn[1].replace('self','').replace(':',' ').replace(',',' ').replace('#',' ').replace(')','').strip()
        print('%2d %-5s %-10s %-27s %s' % (count, typ[:-1], bereich, fn[0], params))
        mode = 0

if __name__ == "__main__":
  grabAPI('./applyai_vision/APIClass.py')
  grabAPI('./pluginProject.py')
  grabAPI('./pluginSystem.py')
