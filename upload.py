import requests
import os
import sys

#curl -i -X POST -H "Content-Type: multipart/form-data" -F "ufile=@Stanzteil_Document_00.jpg" http://localhost:5000/api/v1/Noise/upload

def upload(url, filename):
  if os.path.isfile(filename):
    files = {'ufile': open(filename, 'rb')}
    r = requests.post(url, files=files)
    print(r)
    print(r.text)
  else:
    print('file ' + filename + ' not found')

if __name__ == "__main__":
  if len(sys.argv) > 2:
    upload(sys.argv[1],sys.argv[2])
  else:
    print('usage: send <plugin> <filename>')
    print('or use curl directly for example:')
    print('curl -i -X POST -H "Content-Type: multipart/form-data" -F "ufile=@imageFile.jpg" http://127.0.0.1:5000/api/v1/Noise/upload')

