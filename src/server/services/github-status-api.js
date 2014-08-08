var github = require('./github');
var Star = require('mongoose').model('Star');

module.exports = {
    updatePullRequestStatus: function(user, repo, repo_uuid, sha, number, token) {
        Star.find({repo: repo_uuid, comm: sha}, function(err, stars) {
            github.call({obj: 'issues', fun: 'repoIssues', arg: {
                user: user,
                repo: repo,
                state: 'open',
                labels: 'review.ninja,pull-request-'+number
            }, token: token}, function(err, issues) {
                var status = 'pending';
                if(issues.length === 0 && stars.length > 0) {
                    status = 'success';
                }
                if(issues.length > 0) {
                    status = 'failure';
                }
                args = {
                    user: user,
                    repo: repo,
                    sha: sha,
                    state: status,
                    description: 'Issues: '+issues.length+', Stars: '+stars.length,
                    target_url: 'http://' + config.server.http.host + ':' + config.server.http.port + '/' + user + '/' + repo + '/pull/' + number
                };
                github.call({
                    obj: 'statuses',
                    fun: 'create',
                    arg: args,
                    token: token
                }, function(err, data) {
                    if (err) {
                        logger.log(err);
                        return;
                    }
                });
            });
        });
    }
};
