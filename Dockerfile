FROM dockerfile/nodejs

COPY . /app

EXPOSE 5000

RUN cd /app; npm install

CMD ["node", "/app/app.js"]
