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
# --------------------------------------------------------------------------------
# --- Python_3 --- (HL / 04.04.2019)
# --------------------------------------------------------------------------------
# Dieser Client verbindet sich mit Roboter RV-3SB (MITSUBISHI)
# und sendet CMD-String
# --------------------------------------------------------------------------------------------------------------------
# Command's:
#
# Pos.      1    6[mm]    15[mm]   24[mm]   33[°]    42[°]    51[°]    60[%]
# '         |    |        |        |        |        |        |        |
# 'Syntax: "G0PO +0000.00 +0000.00 +0000.00 +0000.00 +0000.00 +0000.00 +000"  (GoPos / Achsen: X Y Z A B C / Geschw.)
# 'Syntax: "GOGS"                                                             (GoGundstellung)
# 'Syntax: "GRFA"                                                             (Greifer AUF)
# 'Syntax: "GRFZ"                                                             (Greifer ZU)
# 'Syntax: "INIT"                                                             (Init)
# 'Syntax: "BRAK"                                                             (Abbruch Auftrag)
# --------------------------------------------------------------------------------------------------------------------
import cherrypy as applyai
import os
import math
import time
import sys
import re
# --------------------------------------------------------------------------------
#from socket import *
import socket
# --------------------------------------------------------------------------------
sys.path.insert(0, "../tools")
#import logfile  # ../tools
# --------------------------------------------------------------------------------
#myTS_RESET    = "\033[0;0;0m"
#myTS_N_RED    = "\033[0;31m"  
#--------------------------------------------------------------------------------
SERVER_IP = "192.168.178.223"
SERVER_PORT = 10004
BUFSIZE = 1024
# --------------------------------------------------------------------------------
# --------------------------------------------------------------------------------
#log = logfile.logFile()
# --------------------------------------------------------------------------------


class classRV3_CMD:
    """Class / HL / 29.01.2019"""

    iSTOP = 0
    iConnectet = 0

    # Ein INet Streaming (TCP/IP) Socket erzeugen
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1) # SG 5.4.2019 versendet sofort

    def __init__(self):
        self.logname = str('ROBOT').ljust(6)
        None

    def connectServer(self):
        # Zum Server verbinden
        try:
            self.s.settimeout(3.0)
            self.s.connect((SERVER_IP, SERVER_PORT))
            self.iConnectet = 1
        except:
            self.iConnectet = 0
            applyai.log("ERROR connectServer failed (Timeout) !", self.logname)
            applyai.log("ERROR Robi RV3-CMD: Connect failed (Timeout) (Adress: " + SERVER_IP + ":" + str(SERVER_PORT) + ") !", self.logname)
            time.sleep(2.0)

    def formatPosCmd(self, x, y, z, a, b, c):
        #
        # Syntax: "GOPO +0420.00 +0000.00 +0200.00 +0000.00 +0000.00 +0000.00 +005"
        #
        tmpX = '{:+08.2f}'.format(x)  # --> "+0000.00"
        tmpY = '{:+08.2f}'.format(y)  # --> "+0000.00"
        tmpZ = '{:+08.2f}'.format(z)  # --> "+0000.00"
        tmpA = '{:+08.2f}'.format(a)  # --> "+0000.00"
        tmpB = '{:+08.2f}'.format(b)  # --> "+0000.00"
        tmpC = '{:+08.2f}'.format(c)  # --> "+0000.00"
        tmpCMD = "GOPO " + tmpX + " " + tmpY + " " + tmpZ + \
            " " + tmpA + " " + tmpB + " " + tmpC + " +100"
        return(tmpCMD)

    def runCMD(self):
        self.connectServer()

    def sendCMD(self, strCMDout):
        #
        if self.iConnectet == 0:
            return
        #
        self.s.settimeout(0)
        # Byte's in String / CMD ist Fertig wenn CMD zurückgesendet wurde
        dummy = self.s.recv(0)
        self.s.settimeout(100)
        #log.logout(log.logType.INFO, "Socket_Client_RV3_CMD", "--> CMD: " + strCMDout)
        l = len(strCMDout)
        # Nachricht senden
        self.s.send(strCMDout.encode())         # String in Byte's
        time.sleep(0.001)
        # Auf Daten vom Server warten
        # Byte's in String / CMD ist Fertig wenn CMD zurückgesendet wurde
        strCMDecho = self.s.recv(BUFSIZE).decode()
        # Daten anzeigen
        #applyai.log ("")
        #applyai.log ("Daten: %s" % (data))
        #log.logout(log.logType.INFO, "Socket_Client_RV3_CMD", "<-- CMD: " +
        #           re.sub('[\r\n]', '', strCMDecho[:l]))
        if strCMDout != re.sub('[\r\n]', '', strCMDecho[:l]):
            applyai.log("ERROR Socket_Client_RV3_CMD COM_ERR: " + strCMDecho[:l], self.logname)
            return(-1)

        return 0

    def stopRun(self):
        self.iSTOP = 1
        # Verbindung trennen
        applyai.log("RV3-CMD: Verbindung wird getrennt !", self.logname)
        self.s.close()
        applyai.log("ENDE RV3-CMD !", self.logname)
        return "-!-"

# --------------------------------------------------------------------------------