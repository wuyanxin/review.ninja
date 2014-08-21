var github = require('./github');
var Star = require('mongoose').model('Star');

module.exports = {
    update: function(args, done) {

        Star.find({repo: args.repo_uuid, comm: args.sha}, function(err, stars) {

            stars = stars || [];

            github.call({
                obj: 'issues', 
                fun: 'repoIssues', 
                arg: {
                    user: args.user,
                    repo: args.repo,
                    state: 'open',
                    labels: 'review.ninja, pull-request-' + args.number
                }, 
                token: args.token
            }, function(err, issues) {

                issues = issues || [];

                var status = issues.length ? 'failure' : stars.length ? 'success' : 'pending';

                github.call({
                    obj: 'statuses',
                    fun: 'create',
                    arg: {
                        user: args.user,
                        repo: args.repo,
                        sha: args.sha,
                        state: status,
                        description: 'Review Ninja: ' + stars.length + ' stars, ' + issues.length + ' issues',
                        target_url: 'http://' + config.server.http.host + ':' + config.server.http.port + '/' + args.user + '/' + args.repo + '/pull/' + args.number
                    },
                    token: args.token
                }, function(err, res) {
                    done(err, res);
                });
            });
        });
    }
};
