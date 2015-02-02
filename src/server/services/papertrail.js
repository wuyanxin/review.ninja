var winston = require('winston');
require('winston-papertrail').Papertrail;

module.exports = (function(){
    return new winston.Logger({
      transports: [
          new winston.transports.Papertrail({
              host: 'logs2.papertrailapp.com',
              port: 25611,
              colorize: true,
              logFormat: function(level, message) {
                  return '[' + level +  '] ' + message;
              }
          })
      ]
    });
})();
