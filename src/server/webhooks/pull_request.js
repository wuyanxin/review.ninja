// models
var Repo = require('mongoose').model('Repo');
var User = require('mongoose').model('User');

//services
var github = require('../services/github');
var url = require('../services/url');
var notification = require('../services/notification');
var status = require('../services/status');

//////////////////////////////////////////////////////////////////////////////////////////////
// Github Pull Request Webhook Handler
//////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(req, res) {

    var repo_uuid = req.args.repository.id;

    Repo.with({
        uuid: repo_uuid
    }, function(err, repo) {

        if (err) {
            return;
        }

        if (repo.ninja) {

            var args = {
                user: req.args.repository.owner.login,
                repo: req.args.repository.name,
                repo_uuid: repo_uuid,
                sha: req.args.pull_request.head.sha,
                number: req.args.number,
                token: repo.token
            };

            var notification_args = {
                slug: req.args.repository.full_name,
                number: req.args.number,
                sender: req.args.sender,
                review_url: url.reviewPullRequest(req.args.repository.owner.login, req.args.repository.name, req.args.number)
            };

            var actions = {
                opened: function() {

                    status.update(args, function(err, data) {
                    });

                    notification.sendmail(req.args.repository.owner.login,
                                          'pull_request_opened',
                                          repo.token,
                                          repo.uuid,
                                          req.args.repository.name,
                                          req.args.number,
                                          notification_args);

                },
                synchronize: function() {

                    status.update(args, function(err, data) {
                    });
                    notification.sendmail(
                                          req.args.repository.owner.login,
                                          'pull_request_synchronized',
                                          repo.token,
                                          repo.uuid,
                                          req.args.repository.name,
                                          req.args.number,
                                          notification_args);

                },
                closed: function() {
                    // a pull request you have been reviewing has closed
                    var merged = req.args.pull_request.merged;

                    if(merged) {
                        
                        io.emit(req.args.repository.owner.login + ':' + req.args.repository.name + ':pull-request-'+req.args.number +':merged', merged);
                    }

                },
                reopened: function() {
                    // a pull request you have reviewed has a been reopened
                    // send messages to responsible users?
                }
            };

            if (actions[req.args.action]) {
                actions[req.args.action]();
            }
        }
    });

    res.end();
};
