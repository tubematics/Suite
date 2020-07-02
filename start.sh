#!/usr/bin/env bash
mosquitto -d -c /etc/mosquitto/mosquitto.conf
cd /home/applyai/gpServer
python main.py Screws 5000

