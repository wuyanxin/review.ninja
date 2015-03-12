'use strict';
var keenio = require('../services/keenio');

module.exports = function(req, res, next) {
    keenio.addEvent(req.args.obj + ':' + req.args.fun, req.args);
    next();
};
