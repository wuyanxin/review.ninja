// models
var User = require('mongoose').model('User');

//services
var github = require('../services/github');
var notification = require('../services/notification');
var status = require('../services/status');
var pullRequest = require('../services/pullRequest');

//////////////////////////////////////////////////////////////////////////////////////////////
// Github Issue Webhook Handler
//////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(req, res) {

    //
    // Helper functions
    //

    function get_issues(user, repo, pull_request_number, token, done) {
        
        github.call({
            obj: 'issues',
            fun: 'repoIssues',
            arg: {
                user: user,
                repo: repo,
                labels: 'review.ninja, ' + 'pull-request-' + pull_request_number,
                state:'open'
            },
            token: token
        }, done);
    }


    function get_pull_request(user, repo, number, token, done) {

        github.call({
            obj:'pullRequests',
            fun:'get',
            arg: {
                user: user,
                repo: repo,
                number:number
            }
        }, done);
    }

    var args = {
        issue_number: req.args.issue.id,
        sender: req.args.sender,
        review_url: req.args.issue.url,
        number: pullRequest.byLabels(req.args.issue.labels)
    };

    User.findOne({ uuid: req.args.sender.id }, function(err, user) {

        var token = user ? user.token : null;

        var actions = {
            opened: function() {

                var pull_request_number = pullRequest.byLabels(req.args.issue.labels);

                if( pull_request_number ) {
                    get_pull_request(req.args.repository.owner.login,
                                     req.args.repository.name,
                                     pull_request_number,
                                     token,
                                     function(err, pull_request) {

                        if(err) {
                            return;
                        }

                        status.update({
                            user: req.args.repository.owner.login,
                            repo: req.args.repository.name,
                            repo_uuid: req.args.repository.id,
                            sha: pull_request.head.sha,
                            number: pull_request.number,
                            token: token
                        }, function(err, data) {
                            
                        });

                        notification.sendmail('new_issue', req.args.repository.owner.login, req.args.repository.name, req.args.repository.id, token, pull_request_number, args);
                    });
                }

            },

            closed: function() {

                var pull_request_number = pullRequest.byLabels(req.args.issue.labels);

                if( pull_request_number ) {

                    get_issues(req.args.repository.owner.login, req.args.repository.name, pull_request_number, token, function(err, issues){

                        if(err) {
                            return;
                        }

                        if(issues.length) {
                            return;
                        }


                        get_pull_request(req.args.repository.owner.login, req.args.repository.name, pull_request_number, token, function(err, pull_request) {

                            if(err){
                                return;
                            }

                            status.update({
                                user: req.args.repository.owner.login,
                                repo: req.args.repository.name,
                                repo_uuid: req.args.repository.id,
                                sha: pull_request.head.sha,
                                number: pull_request.number,
                                token: token
                            }, function(err, data) {
                                
                            });

                            notification.sendmail('closed_issue', req.args.repository.owner.login, req.args.repository.name, req.args.repository.id, token, pull_request_number, args);
                        });

                    });
                }
                
            },

            reopened: function() {
                // udpate the status 
                // send email if pull req is open and unmerged 
                // (logic belongs in notification service)
            }
        };

        if (actions[req.args.action]) {
            actions[req.args.action]();
        }

        res.end();
    });
};
