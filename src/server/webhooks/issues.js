var logger = require('../log');
// models
var Repo = require('mongoose').model('Repo');
var User = require('mongoose').model('User');

//services
var github = require('../services/github');
var notification = require('../services/notification');
var GitHubStatusApiService = require('../services/github-status-api');

//////////////////////////////////////////////////////////////////////////////////////////////
// Github Pull Request Webhook Handler
//////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(req, res) {

    var uuid = req.body.repository.id;

    function get_collaborators(user, repo, token, done) {
        var args = {
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
                return collaborator.id;
            });
            
            User.find().where('uuid').in(collaborator_ids).exec(function(err, collaborators) {
                done(err, collaborators);
            });
        });
    }


    function get_issues(user, repo,pull_request_label, token, done) {
        
        label = 'review.ninja,'+String(pull_request_label);

        var args = {
            user: user,
            repo: repo,
            labels: label,
            state:'open'
        };

        github.call({
            obj: 'issues',
            fun: 'repoIssues',
            arg: args,
            token: token
        }, function(err, issues) {
            done(err,issues);
        });
    }


    function get_pull_request(user,repo,number, token, done){
        var args= {
            user: user,
            repo: repo,
            number:number
        };

        github.call({
            obj:'pullRequests',
            fun:'get',
            arg: args,
            token:token
        }, function(err,pull_request){
            done(err,pull_request);
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
            var labels = req.body.issue.labels;
            var state = req.body.issue.state;
            var assignee = req.body.issue.assignee;
            var repository = req.body.repository;
            var sender = req.body.sender;
            var user = repository.owner.login;
            var repo_name = repository.name;
            var review_url = req.body.issue.url;



            get_collaborators(user, repo_name, repo.token, function(err, collaborators) {
                if (err) {
                    logger.log(err);
                }

                var actions = {
                    opened: function() {

                        var found_review = false;

                        for(var review_index = 0; review_index <labels.length;review_index++)
                        {

                            var review_label = labels[review_index];

                            if(review_label.name == 'review.ninja'){
                                found_review = true;
                                break;
                            }


                        }


                        if(!found_review){
                            return;
                        }

                        var found_label = false;
                        var pull_request_number = 0;
                        for(var index = 0; index < labels.length; index++){

                            var label = labels[index];
                            var reg = /pull-request-(\d*)?/;
                            var match =reg.exec(label.name); 

                            if(match){
                                found_label = true;
                                pull_request_number = match[1];
                                break;
                            }

                        }

                        if(!found_label){
                            return;
                        }
                       
                        get_pull_request(user,repo_name,pull_request_number,repo.token, function(err, pull_request){

                            arg = {
                                user: user,
                                repo: repo_name,
                                repo_uuid: uuid,
                                sha: pull_request.head.sha,
                                number: pull_request_number,
                                token: repo.token
                            };

                           GitHubStatusApiService.updateCommit(arg, function(err, data) {
                                notification.new_issue(sender,collaborators,pull_request_number,review_url,repo);
                                return;
                           });

                        });

                    },
                    closed: function() {
                        // an issue has been closed

                        var found_review = false;

                        for(var review_index = 0; review_index <labels.length;review_index++)
                        {


                            var review_label = labels[review_index];

                            if(review_label.name == 'review.ninja'){
                                found_review = true;
                                break;
                            }


                        }


                        if(!found_review){
                            return;
                        }

                        var found_label = false;
                        var pull_request_number = 0;
                        for(var index = 0; index < labels.length; index++){

                            label = labels[index];
                            var reg = /pull-request-(\d*)?/;
                            match =reg.exec(label.name); 

                            if(match){
                                found_label = true;
                                pull_request_number = match[1];
                                break;
                            }

                        }

                        if(!found_label){
                            return;
                        }
                      

                        get_issues(user, repo_name,label.name,repo.token, function(err,issues){
                                    
                            if(err){
                                logger.log(err);
                            }
                            if(issues.length!==0 ){
                                return;

                            }


                            get_pull_request(user,repo_name,pull_request_number,repo.token, function(err, pull_request){

                                if(err){
                                    logger.log(err);
                                }

                                arg = {
                                    user: user,
                                    repo: repo_name,
                                    repo_uuid: uuid,
                                    sha: pull_request.head.sha,
                                    number: pull_request_number,
                                    token: repo.token
                                };

                               GitHubStatusApiService.updateCommit(arg, function(err, data) {
                                    notification.issues_close(sender,collaborators,pull_request_number,review_url);
                                    return;
                               });

                            });

                        });



    
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
