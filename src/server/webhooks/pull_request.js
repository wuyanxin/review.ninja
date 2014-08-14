var logger = require('../log');
// models
var Repo = require('mongoose').model('Repo');
var User = require('mongoose').model('User');

//services
var github = require('../services/github');
var notification = require('../services/notification');
var status = require('../services/status');

//////////////////////////////////////////////////////////////////////////////////////////////
// Github Pull Request Webhook Handler
//////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(req, res) {

    var repo_uuid = req.body.repository.id;

    Repo.with({
        uuid: repo_uuid
    }, function(err, repo) {

        if (err) {
            return logger.log(err);
        }

        if (repo.ninja) {

            // to be reviewed by review.ninja so let's go on

            var action = req.body.action;
            var pull_request_number = req.body.number;
            var repository = req.body.repository;
            var user = repository.owner.login;
            var repo_name = repository.name;
            var slug = repository.full_name;
            var sender = req.body.sender;
            var review_url = 'http://' + config.server.http.host + ':' + config.server.http.port + '/' + repository.full_name + '/pull/' + req.body.number;
            var latest_commit_sha = req.body.pull_request.head.sha;

            args = {
                user: user,
                repo: repo_name,
                repo_uuid: repo_uuid,
                sha: latest_commit_sha,
                number: pull_request_number,
                token: repo.token
            };

            var actions = {
                opened: function() {

                    status.update(args, function(err, data) {
                    });

                    notification.pull_request_opened(user, slug, pull_request_number, sender, review_url, repo, repo_name);
                },
                synchronize: function() {
                    status.update(args, function(err, data) {
                    });

                    notification.pull_request_synchronized(user, slug, pull_request_number, sender, review_url, repo, repo_name);
                },
                closed: function() {
                    // a pull request you have been reviewing has closed
                    // nothing to do
                },
                reopened: function() {
                    // a pull request you have reviewed has a been reopened
                    // send messages to responsible users?
                }
            };

            if (!actions[action]) {
                return logger.log('unsupported action for pull requests');
            }

            actions[action]();
        }

        res.end();
    });
};
