// module
var github = require('../services/github');

module.exports = {

/************************************************************************************************************

    @github

    + issues.create

************************************************************************************************************/

    add: function(req, done) {

        var fileReference = '`none`';
        if(req.args.reference) {

            var url = 'https://' + 
                      config.github.host + '/' + 
                      req.args.user + '/' + 
                      req.args.repo + '/' +
                      'blob/' + 
                      req.args.reference;

            fileReference = '[' + req.args.reference.replace(req.args.sha + '/', '') + ']' + '(' + url + ')';
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
        }, function(err, issue) {
            done(err, issue);
        });
    }
};
