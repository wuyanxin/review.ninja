var sugar = require('array-sugar');

module.exports = function(req, res, next) {

	var whitelist = [
		'/chimp/add'
	];

	if (req.isAuthenticated() || whitelist.contains(req.url)) {
		return next();
	}

	res.send(401, 'Authentication required');
};