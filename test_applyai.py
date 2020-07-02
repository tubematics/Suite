import time
import requests
import os
import subprocess

def startProject(name, port):
    print('Starting project ' + name + ' on port ' + str(port))
    process = subprocess.Popen(['python3', 'main.py', name, port])

def triggerProject(port):
    print('Triggering project ...')
    resp = requests.get('http://localhost:' + port + '/api/v1/Project/sendCmd?CMD=detect')
    return True

def stopProject(port):
    print('Stopping system')
    resp = requests.get('http://localhost:' + port + '/api/v1/System/shutdown')

def runtest(name, port):
    startProject(name, port)
    time.sleep(5)
    assert triggerProject(port) == True
    time.sleep(1)
    stopProject(port)
    time.sleep(5)

def test_Washers():
    runtest('Washers', '5000')

def test_Screws():
    runtest('Screws', '5000')
    
def test_Stanzteil():
    runtest('Stanzteil', '5000')
    

