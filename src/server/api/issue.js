// module
var github = require('../services/github');
var url = require('../services/url');

module.exports = {

/************************************************************************************************************

    @github

    + issues.create

************************************************************************************************************/

    add: function(req, done) {
        var fileReference = '`none`';

        if(req.args.reference) {
            var referenceUrl = url.githubFileReference(req.args.user, req.args.repo, req.args.reference);
            // req.args.reference is 'sha/path/to/file#Lline_number this line trims the sha
            fileReference = '[' + req.args.reference.replace(req.args.sha + '/', '') + ']' + '(' + referenceUrl + ')';
        }
            
        var body = req.args.body + '\r\n\r\n';
        body += '|commit|file reference|\r\n';
        body += '|------|--------------|\r\n';
        body += '|' + req.args.sha + '|' + fileReference + '|';

        github.call({
            obj: 'issues', 
            fun: 'create', 
            arg: {
                user: req.args.user,
                repo: req.args.repo,
                body: body,
                title: req.args.title,
                labels: ['review.ninja', 'pull-request-' + req.args.number]
            }, 
            token: req.user.token
        }, done);
    }
};
