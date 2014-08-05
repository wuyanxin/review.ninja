// module
var github = require('../services/github');

module.exports = {

/************************************************************************************************************

    @github

    + issues.create

************************************************************************************************************/

	add: function(req, done) {
            
        var body = '--- Pull Request #' + req.args.number + ' on commit ' + req.args.sha  + ' ---';

        if(req.args.file_references) {
            req.args.file_references.forEach(function(file_reference) {
                body += '\n\n';
                body += '--- File: ' + file_reference.file_name + ' (' + file_reference.start + ' - ' + file_reference.end + ' ) ---';
            });
        }

        body = body + '\n\n' + req.args.body;

		github.call({obj: 'issues', fun: 'create', arg: {
			user: req.args.user,
			repo: req.args.repo,
			body: body,
			title: req.args.title,
			labels: ['review.ninja', 'pull-request-' + req.args.number]
		}, token: req.user.token}, function(err, obj) {
			done(null, obj);
		});
	}
};
