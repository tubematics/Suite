import cherrypy as applyai
import applyai_plugin as plugin
import applyai_memStore as ms
import cv2
import os
import importlib.machinery as loader
import sys
import datetime

if len(sys.argv) < 3:
    print('Usage python3 pluginTester.py <name and path of plugin> <name and path of input image>')

else:

    filepath = sys.argv[1]
    pName = filepath.split('/')[-1].replace('.py','').replace('plugin','')
    mod_name,file_ext = os.path.splitext(os.path.split(filepath)[-1])
    py_mod = loader.SourceFileLoader(mod_name, filepath).load_module()

    applyai._cplogging.LogManager.time = lambda self : '[' + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")[:23] + ']'
    applyai._cplogging.LogManager.access_log_format = ( '{t} WEBGUI {h} "{r}" {s} {b}' ) #"{f}" "{a}"'  )

    applyai.tree.mount(py_mod.applyaiPlugin.API(), '/' + pName, '../projects/BrakeClipType1/config/Project.conf')
    plugin.Plugin(applyai.engine, py_mod.applyaiPlugin.PCode).subscribe()

    applyai.engine.start()

    frame = cv2.imread(sys.argv[2])
    store = ms.memStore(pName)
    store.updateFrameIn('Noise',0,frame)
    #store.updateFrameIn(pName,  0,frame)

    applyai.engine.block()

