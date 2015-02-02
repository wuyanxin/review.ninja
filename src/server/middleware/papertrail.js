var papertrail = require('../services/papertrail');

module.exports = function(req, res, next) {
    console.log('papertrail - ' + req.args.fun + '_' + req.args.obj + ' - ' + req.args);
    console.log(req.args);
    papertrail.info(req.args.fun + '_' + req.args.obj);
    next();
};
