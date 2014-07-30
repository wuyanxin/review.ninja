// module
var github = require('../services/github');

module.exports = {

/************************************************************************************************************

    @github

    + issues.create

************************************************************************************************************/

    add: function(req, done) {

        var body = req.args.body;

        if (req.args.comm) {

            body += '\n\n';

            body += '| Commit |' + req.args.comm + ' |\n';
            body += '| ------ | -------------------- |\n';

            if (req.args.path) {
                body += '| File | ' + req.args.path + ' |\n';
            }

            if (req.args.line) {
                body += '| Line | ' + req.args.line + ' |\n';
            }

        }

        github.call({
            obj: 'issues',
            fun: 'create',
            arg: {
                user: req.args.user,
                repo: req.args.repo,
                body: body,
                title: req.args.title,
                labels: ['review.ninja']
            },
            token: req.user.token
        }, function(err, obj) {
            done(null, null);
        });

    }
};
