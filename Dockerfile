# run with
#docker run -it \
#-v /applyai/common:/home/applyai/common \
#-v /applyai/roboGUI/dist:/home/applyai/roboGUI/dist \
#-p 5000:5000 \
#stephen/mydock

FROM jjanzic/docker-python3-opencv

RUN apt-get update
RUN apt-get install -y mosquitto
COPY mosquitto.conf /etc/mosquitto

RUN pip3 install cherrypy
RUN pip3 install Pillow

WORKDIR /home/applyai/gpServer

COPY requirements.txt ./

RUN pip3 install -r requirements.txt
COPY . .
EXPOSE 5000

CMD ["/bin/bash","./start.sh"]
