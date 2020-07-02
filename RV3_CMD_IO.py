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
#--- Python_3 --- (HL / 30.01.2019)
#--------------------------------------------------------------------------------
# Haupt-Class zur Kommunikation mit Roboter RV-3SB (MITSUBISHI)
#  - Empfange Statuswerte
#  - Sende Commandos
#--------------------------------------------------------------------------------
# Abhänigkeiten:
#  - Socket_Client_RV3_STATUS.py
#  - Socket_Client_RV3_CMD.py
#--------------------------------------------------------------------------------
import cherrypy as applyai
import os
import threading
import time
import sys

import Socket_Client_RV3_STATUS
import Socket_Client_RV3_CMD
#--------------------------------------------------------------------------------
axisValues = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0] # Achsen: X Y Z A B C
digiValues = [False, False, False, False]   # Index: 0 = Unterwegs
                                            #        1 = PosErreicht
                                            #        2 = CMD-InArbeit
                                            #        3 = GS-Erreicht
#--------------------------------------------------------------------------------
myRV3_S = Socket_Client_RV3_STATUS.classRV3_Status() # Class-Instanzierung
myRV3_C = Socket_Client_RV3_CMD.classRV3_CMD()       # Class-Instanzierung
#--------------------------------------------------------------------------------
class classRV3_CMD_IO:
    """Class / HL / 30.01.2019"""

    iSTOP = 0
    #--------------------------------------------------------
    def __init__(self):
        self.logname = str('ROBOT').ljust(6)
        None
    #--------------------------------------------------------
    def getStatus(self): # Zyklisch Daten abholen
        #
        while (self.iSTOP == 0):
            time.sleep(0.02)

            data_A = myRV3_S.getAxisData()
            axisValues[0] = data_A[0]  # X [mm]
            axisValues[1] = data_A[1]  # Y [mm]
            axisValues[2] = data_A[2]  # Z [mm]
            axisValues[3] = data_A[3]  # A [°]
            axisValues[4] = data_A[4]  # B [°]
            axisValues[5] = data_A[5]  # C [°]

            data_D = myRV3_S.getDigiData()
            digiValues[0] = data_D[0]  # Flag (Unterwegs)
            digiValues[1] = data_D[1]  # Flag (PosErreicht)
            digiValues[2] = data_D[2]  # Flag (CMD-InArbeit)
            digiValues[3] = data_D[3]  # Flag (GS-Erreicht)
    #--------------------------------------------------------
    def getAxisValues(self):
        return axisValues
    #--------------------------------------------------------
    def getDigiValues(self):
        return digiValues
    #--------------------------------------------------------
    def formatPosCmd(self,x,y,z,a,b,c):
        return myRV3_C.formatPosCmd(x,y,z,a,b,c)
    #--------------------------------------------------------
    def sendCMD(self, strCMD): # Syntax siehe Class "classRV3_CMD"
        myRV3_C.sendCMD(strCMD)
        return 0
    #--------------------------------------------------------
    def startRun(self):

        t1 = threading.Thread(target=myRV3_S.runStatus)
        t1.start()

        t2 = threading.Thread(target=myRV3_C.runCMD)
        t2.start()

        time.sleep(1.0)

        t3 = threading.Thread(target=self.getStatus)
        t3.start()
    #--------------------------------------------------------
    def stopRun(self):
        self.iSTOP = 1
        time.sleep(0.2)
        myRV3_S.stopRun()
        time.sleep(0.3)
        myRV3_C.stopRun()
        time.sleep(0.2)
        applyai.log("--> ENDE RV3 IO/CMD !", self.logname)
        return "-!-"
#--------------------------------------------------------------------------------
