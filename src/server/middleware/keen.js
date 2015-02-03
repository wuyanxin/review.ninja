var keenio = require('../services/keenio');

module.exports = function(req, res, next) {
    keenio.addEvent(req.args.fun + ':' + req.args.obj, req.args);
    next();
};
