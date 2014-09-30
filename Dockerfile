FROM dockerfile/nodejs

COPY . /app

EXPOSE 5000

RUN npm install -g bower
RUN cd /app; npm install; bower install --allow-root

WORKDIR /app

VOLUME ["/certs"]

ENV CERT /certs/*.pem

CMD ["node", "/app/app.js"]
