import cherrypy as applyai
import logging
import logging.config
import datetime

# init the logger format asap

applyai._cplogging.LogManager.time = lambda self : '[' + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")[:23] + ']'
applyai._cplogging.LogManager.access_log_format = ( '{t} WEBGUI {h} "{r}" {s} {b}' ) #"{f}" "{a}"'  )
