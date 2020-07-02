class Colors:
    def __init__(self):
        self.list = {}
        self.index = []
        # list is rgb
        self.list['black']   = (  0,   0,   0)
        self.list['gray']    = (128, 128, 128)
        self.list['silver']  = (192, 192, 192)
        self.list['white']   = (255, 255, 255)
        self.list['maroon']  = (128,   0,   0)
        self.list['red']     = (255,   0,   0)
        self.list['olive']   = (128, 128,   0)
        self.list['yellow']  = (255, 255,   0)
        self.list['green']   = (  0, 128,   0)
        self.list['lime']    = (  0, 255,   0)
        self.list['teal']    = (  0, 128, 128)
        self.list['aqua']    = (  0, 255, 255)
        self.list['navy']    = (  0,   0, 128)
        self.list['blue']    = (  0,   0, 255)
        self.list['purple']  = (128,   0, 128)
        self.list['fuchsia'] = (255,   0, 255)
        # change to bgr
        for c in self.list:
            self.list[c] = tuple(reversed(self.list[c]))
            self.index.append(self.list[c])

if __name__ == "__main__":
    c = Colors()
    print(c.list['red'])
    print(c.index[10])

    for i in c.list:
        print(i)
