'use strict';
var winston = require('winston');
var Papertrail = require('winston-papertrail').Papertrail;

module.exports = (function(){
    var transports = config.server.papertrail.host ? [
      new Papertrail({
          host: config.server.papertrail.host || '',
          port: config.server.papertrail.port || '',
          colorize: true,
          logFormat: function(level, message) {
              return '[' + config.server.papertrail.location + ']' + '[' + level + '] ' + message;
          }
      })
    ] : [];

    return new winston.Logger({
      transports: transports
    });
})();
