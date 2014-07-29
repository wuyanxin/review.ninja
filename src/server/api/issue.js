// module
var github = require('../services/github');

module.exports = {

/************************************************************************************************************

    @github

    + issues.create

************************************************************************************************************/

	add: function(req, done) {
		github.call({obj: 'issues', fun: 'create', arg: {
			user: req.args.user,
			repo: req.args.repo,
			body: req.args.body,
			title: req.args.title,
			labels: ['review.ninja', 'pull-request-'+req.args.pull_number]
		}, token: req.user.token}, function(err, obj) {
			done(null, null);
		});
	}
};
