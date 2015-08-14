'use strict';

var https = require('https');
var fs = require('fs');
var crypto = require('crypto');

//////////////////////////////////////////////////////////////////////////////////////////////
// Initialize server
//////////////////////////////////////////////////////////////////////////////////////////////

var app = require('./src/server/app.js');

console.log('Now lets create the server');

var privateKey = fs.readFileSync('someprivatekey.pem').toString();
var certificate = fs.readFileSync('somecertificate.pem').toString();

var credentials = crypto.createCredentials({key: privateKey, cert: certificate});

var server = https.createServer(app).setSecure(credentials).listen(config.server.localport);

//////////////////////////////////////////////////////////////////////////////////////////////
// Initialize websockets
//////////////////////////////////////////////////////////////////////////////////////////////

global.io = require('socket.io').listen(server).sockets;

io.on('connection', function(socket) {
    socket.emit('init', {
        message: 'Welcome!'
    });
});
