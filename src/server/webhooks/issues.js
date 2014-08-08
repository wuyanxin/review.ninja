var logger = require('../log');
// models
var Repo = require('mongoose').model('Repo');
var User = require('mongoose').model('User');

//services
var github = require('../services/github');
var notification = require('../services/notification');

//////////////////////////////////////////////////////////////////////////////////////////////
// Github Pull Request Webhook Handler
//////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(req, res) {

    var uuid = req.body.repository.id;

    function get_collaborators(user, repo, token, done) {
        args = {
            user: user,
            repo: repo
        };
        github.call({
            obj: 'repos',
            fun: 'getCollaborators',
            arg: args,
            token: token
        }, function(err, collaborators) {
            var collaborator_ids = collaborators.map(function(collaborator) {
                console.log('Collaborators: '+collaborator);
                return collaborator.id;
            });
            
            User.find().where('uuid').in(collaborator_ids).exec(function(err, collaborators) {
                done(err, collaborators);
            });
        });
    }


    function get_issues(user, repo, token, done) {
        args = {
            user: user,
            repo: repo
        };
        github.call({
            obj: 'repos',
            fun: 'getIssues',
            arg: args,
            token: token
        }, function(err, issues) {
            done(err,issues);
        });
    }

    Repo.with({
        uuid: uuid
    }, function(err, repo) {
        if (err) {
            logger.log(err);
        }
        if (repo.ninja) {
            // to be reviewed by review.ninja so let's go on

            var action = req.body.action;
            var issue = req.body.issue;
            var number = req.body.issue.number;
            var labels = req.body.issue.label;
            var state = req.body.issue.state;
            var assignee = req.body.issue.assignee;
            var repository = req.body.repository;
            var sender = req.body.sender;
            var user = req.body.issue.user;
            var repo_name = repository.name;

            var review_url = req.body.issue.url;

            get_collaborators(user, repo_name, repo.token, function(err, collaborators) {
                if (err) {
                    logger.log(err);
                }

                var actions = {
                    opened: function() {

                        for(var label in labels){
                            if(label.name == 'review.ninja'){

                                notification.new_issue(sender,collaborators,number,review_url);

                            }
                        }

                    },
                    closed: function() {
                        // an issue has been closed

                        for(var label in labels){
                            if(label.name.match(/pull-request-\d*?/)){
                                var pull_request_number = label.name;

                                get_issues(user, repo_name, repo.token, function(err, all_issues) {

                                    for (iss in all_issues){

                                        for(issue_label in iss.labels){
                                            if(issue_label == label && iss.state=='open'){
                                                return;
                                            }
                                        }
                                    }

                                    notification.issues_close(sender,collaborators,pull_request_number,review_url);

                                });

                            }

                        }

                    },
                    reopened: function() {
                        // an issue has been reopened
                        // send messages to responsible users?
                    }
                };
                if (actions[action]) {
                    actions[action]();
                    return;
                }
                logger.log('unsupported action for pull requests');
            });
        }
        res.end();
    });
};
