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
#--------------------------------------------------------------------------------
#--- Python_3 --- (HL / 04.04.2019)
#--------------------------------------------------------------------------------
# Dieser Client verbindet sich mit Roboter RV-3SB (MITSUBISHI)
# und empfängt Statusdaten
#-----------------------------------------------------------------------------------------
# Empfangs-String:
#
#          |---- 10x Byte's in HEX ----| |-------- 6x Achswerte (X,Y,Z,A,B,C) ---------|
# Syntax: "FF;FF;FF;FF;FF;FF;FF;FF;FF;FF;123.456;123.456;123.456;123.456;123.456;123.456;"
#-----------------------------------------------------------------------------------------
import cherrypy as applyai
import sys
sys.path.insert(0,"../tools")
#--------------------------------------------------------------------------------
import os
import math
import time

from socket import *
#--------------------------------------------------------------------------------
#import logfile      # ../tools
#log = logfile.logFile() # Class-Instanzierung
#--------------------------------------------------------------------------------
#myTS_RESET    = "\033[0;0;0m"
#myTS_N_RED    = "\033[0;31m"  
#--------------------------------------------------------------------------------
SERVER_IP   = "192.168.178.223"
SERVER_PORT = 10002
BUFSIZE     = 1024
#--------------------------------------------------------------------------------
arrAxisData = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
arrDigiData = [False, False, False, False, False, False, False, False]
#--------------------------------------------------------------------------------
class classRV3_Status:
    """Class / HL / 30.01.2019"""

    iSTOP = 0
    iConnectet = 0

    # Ein INet Streaming (TCP/IP) Socket erzeugen
    s = socket(AF_INET, SOCK_STREAM)

    def __init__(self):
        self.logname=str('ROBOT').ljust(6)
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
            applyai.log("ERROR Robi RV3-Status: Connect failed (Timeout) (Adress: " + SERVER_IP + ":" + str(SERVER_PORT) + ") !", self.logname)
            time.sleep(2.0)

    def runStatus(self):

        self.connectServer()
        
        if self.iConnectet == 0:
            return

        # Unsere Nachricht senden
       #s.send(msg.encode())  # String in Byte's

        # Auf Daten vom Server warten
        while (self.iSTOP == 0):
            data = self.s.recv(BUFSIZE).decode()  # Byte's in String
            arrTMP = data.replace("\r", "").split(';')

           #print ("LEN: " + str(len(arrTMP)))
            if len(arrTMP) == 16: 
                arrAxisData[0] = float(arrTMP[10])                  # Achse-X
                arrAxisData[1] = float(arrTMP[11])                  # Achse-Y
                arrAxisData[2] = float(arrTMP[12])                  # Achse-Z
                arrAxisData[3] = math.degrees(float(arrTMP[13]))    # Achse-A
                arrAxisData[4] = math.degrees(float(arrTMP[14]))    # Achse-B
                arrAxisData[5] = math.degrees(float(arrTMP[15]))    # Achse-C

                arrDigiData[0] = (int(arrTMP[6], 16) == (int(arrTMP[6], 16) | 1))     #BIT-Status (Unterwegs)
                arrDigiData[1] = (int(arrTMP[6], 16) == (int(arrTMP[6], 16) | 2))     #BIT-Status (PosErreicht)
                arrDigiData[2] = (int(arrTMP[6], 16) == (int(arrTMP[6], 16) | 4))     #BIT-Status (CMD-In Arbeit)
                arrDigiData[3] = (int(arrTMP[6], 16) == (int(arrTMP[6], 16) | 16))    #BIT-Status (GS-Erreicht)


        # Verbindung trennen
        appyai.log("RV3-Status: Verbindung wird getrennt !", self.logname)
        self.s.close()


    def getAxisData(self):
        return arrAxisData


    def getDigiData(self):
        return arrDigiData


    def stopRun(self):
        self.iSTOP = 1
        time.sleep(1.0)
        applyai.log("STOPPED RV3-Status !", self.logname)
        return "-!-"

#--------------------------------------------------------------------------------
