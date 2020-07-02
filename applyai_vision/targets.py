import json

class Targets:
  columns = []
  data = []
  def __init__(self):
    Targets.columns = ['plugin', 'id']
    pass

  def add(self, plugin, id, din):
    std = {}
    std['plugin'] = plugin
    std['id'] = id
    for i, d in enumerate(din):
      if d not in Targets.columns:
        Targets.columns.append(d)
      std[d] = din[d]
    Targets.data.append(std)

  def length(self):
    return len(Targets.data)

  def loc(self, attr, value):
    for d in Targets.data:
      if attr in d:
        if d[attr] == value:
          return(d)
    return({})

  def read(self, idx):
    if idx >= 0 and idx < len(Targets.data):
      return Targets.data[idx]
    else:
      return {}

  def fetch(self):
    ret = [] #Targets.data.copy()
    for d in Targets.data:
      obj = {}
      for c in Targets.columns:
        if c in d:
          fmtStr = "%0.3f"
          #if 'x' in c or 'y' in c:
          #  fmtStr = "%0.1f"
          if self.isNum(str(d[c])) and (c != 'id' and c != 'code'):
            obj[c] = str(fmtStr % float(d[c]))
          else:
            obj[c] = str(d[c])
        else:
          obj[c] = 'null'
      ret.append(obj)
    return ret

  def write(self, idx, data):
    if idx >= 0 and idx < len(Targets.data):
      Targets.data[idx] = data

  def removeByClass(self, klass):
    targets = []
    for d in Targets.data:
      if 'class' in d:
        if d['class'] != klass:
          targets.append(d)
    Targets.data = targets

  def set(self, idx, attr, data):
    if idx >= 0 and idx < len(Targets.data):
      if attr in Targets.data[idx]:
        Targets.data[idx][attr] = data

  def get(self, idx, attr):
    if idx >= 0 and idx < len(Targets.data):
      if attr in Targets.data[idx]:
        return Targets.data[idx][attr]
    return 0 # TODO DANGEROUS RETURN VALUE

  def reset(self):
    Targets.columns = ['plugin', 'id']
    Targets.data = []

  def isNum(self, num):
    return num.lstrip('-').replace('.','',1).isdigit()

  def to_json(self):
    return json.dumps(Targets.data)

  def print(self):
    for i in Targets.data:
      s = ''
      for c in Targets.columns:
        if c in i:
          if self.isNum(str(i[c])):
            s += str("%0.2f" % float(i[c]))
          else:
            s += str(i[c])
        else:
          s += 'null'
        s += '~'
      print(s)

if __name__ == "__main__":
  targets = Targets()
  d = {}
  d['idx'] = 1
  d['cx'] = 12.0
  d['cy'] = 99.01
  #for d, i in enumerate(data):
  #  print(d,i)
  targets.add('Clrcles', 'C.0.1', d)
  targets.add('Clrcles', 'C.0.1', {'cx': 22.0})
  targets.print()
