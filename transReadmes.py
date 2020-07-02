from googletrans import Translator

translator = Translator()

if __name__ == "__main__":

  plugins = [
      "BBox",
      "Calc",
      "Camera",
      "Capture",
      "Circles",
      "Classify",
      "Color",
      "Edges",
      "Ellipse",
      "FillGap",
      "FillHoles",
      "Flir",
      "GripPos",
      "Lines",
      "Mask",
      "MaskEnds",
      "Model",
      "Noise",
      "Part",
      "PartialModel",
      "Pixel2mm"
  ]
  for p in plugins:

    path = './stdPlugins/' + p + '/README.md'
    with open(path,'r') as infile:
      rtxt = infile.read()

    translated = translator.translate(rtxt, dest='de')

    path = './stdPlugins/' + p + '/README_DE.md'
    with open(path,'w') as outfile:
      outfile.write(translated.text)
