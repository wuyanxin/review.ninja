'use strict';
var Keen = require('keen-js');

module.exports = (function(){
    return new Keen({
        projectId: config.server.keen.pid,
        writeKey: config.server.keen.writeKey,
        readKey: config.server.keen.readKey,
        protocol: 'http',
        host: 'api.keen.io/3.0',
        requestType: 'jsonp'
    });
})();
