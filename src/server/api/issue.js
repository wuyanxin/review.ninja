// module
var github = require('../services/github');

module.exports = {

    /************************************************************************************************************

    @github

    + issues.create

************************************************************************************************************/

	add: function(req, done) {
        var body = req.args.body;

        if(req.args.pull_request) {
            body += '\n\n';
            body += '--- Pull Request #' + req.args.pull_request.number + ' on commit ' + req.args.pull_request.head.sha  + ' ---';
        }

        if(req.args.file_references) {
            req.args.file_references.forEach(function(file_reference) {
                body += '\n\n';
                body += '--- File: ' + file_reference.file_name + ' (' + file_reference.start + ' - ' + file_reference.end + ' ) ---';
            });
        }

		github.call({obj: 'issues', fun: 'create', arg: {
			user: req.args.user,
			repo: req.args.repo,
			body: req.args.body,
			title: req.args.title,
			labels: ['review.ninja', 'pull-request-'+req.args.pull_request.number]
		}, token: req.user.token}, function(err, obj) {
			done(null, null);
		});
	}
};
