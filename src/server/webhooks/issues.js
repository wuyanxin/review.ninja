// models
var User = require('mongoose').model('User');
var Milestone = require('mongoose').model('Milestone');

//services
var url = require('../services/url');
var github = require('../services/github');
var status = require('../services/status');
var pullRequest = require('../services/pullRequest');
var notification = require('../services/notification');

//////////////////////////////////////////////////////////////////////////////////////////////
// Github Issue Webhook Handler
//////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(req, res) {

    //
    // Helper functions
    //

    function getPull(user, repo, number, token, done) {
        github.call({
            obj: 'pullRequests',
            fun: 'get',
            arg: {
                user: user,
                repo: repo,
                number: number
            },
            token: token
        }, done);
    }

    function getMilestone(user, repo, number, token, done) {
        github.call({
            obj: 'issues',
            fun: 'getMilestone',
            arg: {
                user: user,
                repo: repo,
                number: number
            },
            token: token
        }, done);
    }

    User.findOne({ _id: req.params.id }, function(err, user) {

        if(err || !user || !req.args.issue.milestone) {
            return res.end();
        }

        Milestone.findOne({
            repo: req.args.repository.id,
            number: req.args.issue.milestone.number
        }, function(err, milestone) {

            if(err || !milestone) {
                return res.end();
            }

            var args = {
                user: req.args.repository.owner.login,
                repo: req.args.repository.name,
                issue: req.args.issue.id,
                sender: req.args.sender,
                number: milestone.pull,
                url: url.reviewPullRequest(req.args.repository.owner.login, req.args.repository.name, milestone.pull)
            };

            var actions = {
                opened: function() {
                    getPull(req.args.repository.owner.login, req.args.repository.name, milestone.pull, user.token, function(err, pull) {
                        if(!err) {
                            status.update({
                                user: req.args.repository.owner.login,
                                repo: req.args.repository.name,
                                repo_uuid: req.args.repository.id,
                                sha: pull.head.sha,
                                number: pull.number,
                                token: user.token
                            });

                            notification.sendmail(
                                'new_issue',
                                req.args.repository.owner.login,
                                req.args.repository.name,
                                req.args.repository.id,
                                user.token,
                                milestone.pull,
                                args
                            );

                            // todo: emit to sockets
                        }
                    });
                },

                closed: function() {

                    // send a notification if all issues are closed
                    getMilestone(req.args.repository.owner.login, req.args.repository.name, milestone.number, user.token, function(err, mile) {
                        if(!err && !mile.open_issues) {
                            notification.sendmail(
                                'closed_issue',
                                req.args.repository.owner.login,
                                req.args.repository.name,
                                req.args.repository.id,
                                user.token,
                                milestone.pull,
                                args
                            );
                        }
                    });

                    // update the status
                    getPull(req.args.repository.owner.login, req.args.repository.name, milestone.pull, user.token, function(err, pull) {
                        if(!err) {
                            status.update({
                                user: req.args.repository.owner.login,
                                repo: req.args.repository.name,
                                repo_uuid: req.args.repository.id,
                                sha: pull.head.sha,
                                number: pull.number,
                                token: user.token
                            });

                            // todo: emit to sockets
                        }
                    });
                },

                reopened: function() {
                    // udpate the status
                    // send email if pull req is open and unmerged
                    // todo: emit to sockets
                }
            };

            if(actions[req.args.action]) {
                actions[req.args.action]();
            }

            res.end();
        });
    });
};
