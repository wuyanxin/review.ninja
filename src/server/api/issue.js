// module
var github = require('../services/github');

module.exports = {

/************************************************************************************************************

    @github

    + issues.create

************************************************************************************************************/

	add: function(req, done) {

        var fileReference = '``none``';
        if(req.args.reference) {
            fileReference = 'https://' + config.github.host + '/' + req.args.user + '/' + req.args.repo + req.args.reference;
        }
            
        var body = '|commit|file reference|\n';
        body +=    '|------|--------------|\n';
        body +=    '|'+req.args.sha+'|'+fileReference+'|';

        body += '\n\n' + req.args.body;

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
