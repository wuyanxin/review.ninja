FROM dockerfile/nodejs

COPY . /app

RUN npm install -g bower
RUN npm install -g forever
RUN cd /app; npm install; bower install --allow-root;

WORKDIR /app

VOLUME ["/certs"]

EXPOSE 5000

CMD ["forever", "/app/app.js"]
