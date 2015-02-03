var winston = require('winston');
require('winston-papertrail').Papertrail;

module.exports = (function(){
    var transports = config.server.papertrail.host ? [
      new winston.transports.Papertrail({
          host: config.server.papertrail.host || '',
          port: config.server.papertrail.port || '',
          colorize: true,
          logFormat: function(level, message) {
              return '[' + level +  '] ' + message;
          }
      })
    ] : [];

    return new winston.Logger({
      transports: transports
    });
})();
