'use strict';
var papertrail = require('../services/papertrail');

module.exports = function(req, res, next) {
    papertrail.info(JSON.stringify(req.args));
    next();
};
