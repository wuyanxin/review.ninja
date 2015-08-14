'use strict';

var https = require('https');
var fs = require('fs');
var crypto = require('crypto');

//////////////////////////////////////////////////////////////////////////////////////////////
// Initialize server
//////////////////////////////////////////////////////////////////////////////////////////////

var app = require('./src/server/app.js');

console.log('Now lets create the server');

var options = {
  key: fs.readFileSync('someprivatekey.pem'),
  cert: fs.readFileSync('somecert.pem')
};

var server = https.createServer(options, app).listen(config.server.localport);

//////////////////////////////////////////////////////////////////////////////////////////////
// Initialize websockets
//////////////////////////////////////////////////////////////////////////////////////////////

global.io = require('socket.io').listen(server).sockets;

io.on('connection', function(socket) {
    socket.emit('init', {
        message: 'Welcome!'
    });
});
