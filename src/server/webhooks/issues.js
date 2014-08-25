// models
var Repo = require('mongoose').model('Repo');
var User = require('mongoose').model('User');

//services
var github = require('../services/github');
var notification = require('../services/notification');
var status = require('../services/status');
var labels = require('../services/labels');

//////////////////////////////////////////////////////////////////////////////////////////////
// Github Issue Webhook Handler
//////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(req, res) {

    var uuid = req.body.repository.id;

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
        }, function(err, issues) {
            done(err,issues);
        });
    }


    function get_pull_request(user, repo, number, token, done){

        github.call({
            obj:'pullRequests',
            fun:'get',
            arg: {
                user: user,
                repo: repo,
                number:number
            }
        }, function(err, pull_request){
            done(err, pull_request);
        });
    }

    Repo.with({
        uuid: uuid
    }, function(err, repo) {

        if (err) {
            return;
        }

        if (repo.ninja) {

            var args = {
                issue_number: req.body.issue.id,
                sender: req.body.sender,
                review_url: req.body.issue.url,
                number: labels.pull_request_label(req.body.issue.labels)
            };


            var actions = {

                opened: function() {

                    var pull_request_number = labels.pull_request_label(req.body.issue.labels);

                    if( pull_request_number ) {

                        get_pull_request(
                                req.body.repository.owner.login, req.body.repository.name, pull_request_number, repo.token, function(err, pull_request) {

                            if(err) {
                                return;
                            }

                            status.update({
                                user: req.body.repository.owner.login,
                                repo: req.body.repository.name,
                                repo_uuid: uuid,
                                sha: pull_request.head.sha,
                                number: pull_request.number,
                                token: repo.token
                            }, function(err, data) {
                                
                            });

                            notification.sendmail(req.body.repository.owner.login, 'new_issue', repo, req.body.repository.name, pull_request_number, args);
                        });
                    }

                },

                closed: function() {

                    var pull_request_number = labels.pull_request_label(req.body.issue.labels);

                    if( pull_request_number ) {

                        get_issues(req.body.repository.owner.login, req.body.repository.name, pull_request_number, repo.token, function(err, issues){

                            if(err){
                                return;
                            }
                            if(issues.length){
                                return;
                            }


                            get_pull_request(req.body.repository.owner.login, req.body.repository.name, pull_request_number, repo.token, function(err, pull_request) {

                                if(err){
                                    return;
                                }

                                status.update({
                                    user: req.body.repository.owner.login,
                                    repo: req.body.repository.name,
                                    repo_uuid: uuid,
                                    sha: pull_request.head.sha,
                                    number: pull_request.number,
                                    token: repo.token
                                }, function(err, data) {
                                    
                                });

                                notification.sendmail(req.body.repository.owner.login, 'closed_issue', repo, req.body.repository.name, pull_request_number, args);
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

            if (actions[req.body.action]) {
                actions[req.body.action]();
            }
        }
    });

    res.end();
};
