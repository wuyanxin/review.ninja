var github = require('./github');
var Star = require('mongoose').model('Star');

module.exports = {
    // args: user, repo, repo_uuid, sha, number, token
    updateCommit: function(args, done) {
        Star.find({repo: args.repo_uuid, comm: args.sha}, function(err, stars) {
            github.call({obj: 'issues', fun: 'repoIssues', arg: {
                user: args.user,
                repo: args.repo,
                state: 'open',
                labels: 'review.ninja,pull-request-'+args.number
            }, token: args.token}, function(err, issues) {
                var status = 'pending';
                if(issues.length === 0 && stars.length > 0) {
                    status = 'success';
                }
                if(issues.length > 0) {
                    status = 'failure';
                }
                arg = {
                    user: args.user,
                    repo: args.repo,
                    sha: args.sha,
                    state: status,
                    description: 'Code Review: Open Issues ('+issues.length+'), Stars ('+stars.length+')',
                    target_url: 'http://' + config.server.http.host + ':' + config.server.http.port + '/' + args.user + '/' + args.repo + '/pull/' + args.number
                };
                github.call({
                    obj: 'statuses',
                    fun: 'create',
                    arg: arg,
                    token: args.token
                }, function(err, data) {
                    if(err) {
                        logger.log(err);
                    }
                    if(done) {
                        done(err, data);
                    }
                });
            });
        });
    }
};
