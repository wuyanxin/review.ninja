var sugar = require('array-sugar');

module.exports = function(req, res, next) {

    if (req.isAuthenticated() || config.whitelist.contains(req.url)) {
        return next();
    }

    res.send(401, 'Authentication required');
};
