var GitHubApi = require('github');

module.exports = function(req, res, next) {

	req.github = new GitHubApi({
		// required
		version: '3.0.0',
		// optional
		timeout: 5000
	});

	if (req.user) {
		req.github.authenticate({
			type: 'oauth',
			token: req.user.token
		});
	}

	next();

};