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

    User.findOne({ _id: req.params.id }, function(err, ninja) {

        if(err || !ninja) {
            return res.status(404).send('User not found');
        }

        if(!req.args.issue.milestone) {
            return res.send('Issue has no milestone');
        }

        Milestone.findOne({
            repo: req.args.repository.id,
            number: req.args.issue.milestone.number
        }, function(err, milestone) {

            if(err || !milestone) {
                return res.status(404).send('Milestone not found');
            }

            var user = req.args.repository.owner.login;
            var repo = req.args.repository.name;
            var issue = req.args.issue.id;
            var sender = req.args.sender;
            var number = milestone.pull;
            var repo_uuid = req.args.repository.id;
            var token = ninja.token;

            console.log('******************************************');
            console.log('user:', user, 'repo:', repo, 'number:', number, 'repo_uuid:', repo_uuid, 'token:', token);
            console.log('******************************************');

            var actions = {
                opened: function() {
                    getPull(user, repo, number, token, function(err, pull) {
                        if(!err) {
                            status.update({
                                user: user,
                                repo: repo,
                                repo_uuid: repo_uuid,
                                sha: pull.head.sha,
                                number: pull.number,
                                token: token
                            });

                            notification.sendmail('new_issue', user, repo, repo_uuid, token, number, {
                                user: user,
                                repo: repo,
                                number: number,
                                issue: issue,
                                sender: sender,
                                url: url.reviewPullRequest(user, repo, number)
                            });

                            // todo: emit to sockets
                        }
                    });
                },

                closed: function() {

                    // send a notification if all issues are closed
                    getMilestone(user, repo, milestone.number, token, function(err, mile) {
                        if(!err && !mile.open_issues) {
                            notification.sendmail('closed_issue', user, repo, repo_uuid, token, number, {
                                user: user,
                                repo: repo,
                                number: number,
                                issue: issue,
                                sender: sender,
                                url: url.reviewPullRequest(user, repo, number)
                            });
                        }
                    });

                    // update the status
                    getPull(user, repo, number, token, function(err, pull) {
                        if(!err) {
                            status.update({
                                user: user,
                                repo: repo,
                                repo_uuid: repo_uuid,
                                sha: pull.head.sha,
                                number: pull.number,
                                token: token
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
