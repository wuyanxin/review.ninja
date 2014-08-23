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

    var repo_uuid = req.body.repository.id;

    Repo.with({
        uuid: repo_uuid
    }, function(err, repo) {

        if (err) {
            return;
        }

        if (repo.ninja) {

            var args = {
                user: req.body.repository.owner.login,
                repo: req.body.repository.name,
                repo_uuid: repo_uuid,
                sha: req.body.pull_request.head.sha,
                number: req.body.number,
                token: repo.token
            };

            var notification_args = {
                slug: req.body.repository.full_name,
                number: req.body.number,
                sender: req.body.sender,
                review_url: url.reviewPullRequest(req.body.repository.owner.login, req.body.repository.name, req.body.number)
            };

            var actions = {
                opened: function() {

                    status.update(args, function(err, data) {
                    });

                    notification.sendmail(req.body.repository.owner.login, 'pull_request_opened', repo, req.body.repository.name, req.body.number, notification_args);
                    // notification.pull_request_opened(
                    //                                 req.body.repository.owner.login,
                    //                                 notification_args, repo,
                    //                                 req.body.repository.name);
                },
                synchronize: function() {
                    console.log('synchrnoized');
                    status.update(args, function(err, data) {
                    });
                    notification.sendmail(req.body.repository.owner.login, 'pull_request_synchronized', repo, req.body.repository.name, req.body.number, notification_args);

                    // notification.pull_request_synchronized(req.body.repository.owner.login, notification_args, repo, req.body.repository.name);
                },
                closed: function() {
                    // a pull request you have been reviewing has closed
                    var merged = req.body.pull_request.merged;

                    if(merged) {
                        
                        io.emit(req.body.repository.owner.login + ':' + req.body.repository.name + ':pull-request-'+req.body.number +':merged', merged);
                    }

                },
                reopened: function() {
                    // a pull request you have reviewed has a been reopened
                    // send messages to responsible users?
                }
            };

            if (!actions[req.body.action]) {
                return;
            }

            actions[req.body.action]();
        }
    });

    res.end();
};
