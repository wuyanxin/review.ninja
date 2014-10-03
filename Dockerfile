FROM dockerfile/nodejs

COPY . /app

EXPOSE 5000

RUN npm install -g bower
RUN cd /app; npm install; bower install nodemon --allow-root; bower install --allow-root;

WORKDIR /app

VOLUME ["/certs"]

CMD ["nodemon", "/app/app.js"]
