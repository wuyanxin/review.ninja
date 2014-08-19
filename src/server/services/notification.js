nodemailer = require('nodemailer');
logger = require('../log');
fs = require('fs');
ejs = require('ejs');

var Conf = require('mongoose').model('Conf');
var User = require('mongoose').model('User');
var github = require('./github');

module.exports = function() {

    function sendmail(user, subj, tmpl, notification_type, repo, repo_name, pull_req_number, args) {

        get_pull_request(pull_req_number, user, repo_name, repo.token, function(err, pull) {

            get_collaborators(user,repo_name,repo.token, function(err, collaborators) {

                if(err) {
                    return logger.log(err);
                }

                collaborators.forEach(function(collaborator){

                    Conf.findOne({
                        user: collaborator.uuid,
                        repo: repo.uuid
                    }, function(err, conf) {

                        if(err || !conf || !conf.watch){
                            return logger.log(err);
                        }

                        var watching = false;

                        for(var key=0; key<conf.watch.length; key++){

                            var watch_branch = conf.watch[key];
                            var re = new RegExp(watch_branch, 'g');

                            if(re.exec(pull.base.ref) || re.exec(pull.head.ref)){

                                watching = true;
                                break;
                            }
                        }

                        if( watching&& ( (notification_type === 'star' && conf.notifications.star) || 
                            (notification_type === 'issue' && conf.notifications.issue) || 
                            (notification_type === 'pull_request' && conf.notifications.pull_request) )){

                            var smtpTransport = nodemailer.createTransport('SMTP', config.server.smtp);

                            var template = fs.readFileSync(tmpl, 'utf-8');

                            var mailOptions = {
                                from: 'Review Ninja <noreply@review.ninja>',
                                to: collaborator.email,
                                subject: subj,
                                html: ejs.render(template, args)
                            };

                            smtpTransport.sendMail(mailOptions, function(err, response) {
                               
                                if (err) {
                                    return logger.log(err);
                                }

                                smtpTransport.close();
                            });
                        }                
                    });
                });
            });
        });
    }

    function get_collaborators(user, repo, token, done) {

        github.call({
            obj: 'repos',
            fun: 'getCollaborators',
            arg: {
                user: user,
                repo: repo
            },
            token: token
        }, function(err, collaborators) {

            if(err) {
                return done(err);
            }
            
            var collaborator_ids = collaborators.map(function(collaborator) {
                return collaborator.id;
            });
            
            User.find().where('uuid').in(collaborator_ids).exec(function(err, collaborators) {
                done(err, collaborators);
            });
        });
    }



    function get_pull_request(pull_req_number, user, repo, token, done) {

        github.call({
            obj: 'pullRequests',
            fun: 'get',
            arg: {
                user: user,
                repo: repo,
                number: pull_req_number
            },
            token: token
        }, function(err, pull) {

            done(err, pull);
        }); 

    }

    return {

        pull_request_opened: function(user, slug, number, sender, review_url, repo, repo_name) {
            // start a review: send messages to appropriate users
            var args = {
                slug: slug,
                number: number,
                sender: sender,
                review_url: review_url
            };

            sendmail(user, 'A new pull request is ready for review', 'src/server/templates/pullReqOpened.ejs', 'pull_request', repo, repo_name, number, args);


        },
        pull_request_synchronized: function(user, slug, number, sender, review_url, repo, repo_name) {
            // a pull request you have been reviewing has a new commit
            var args = {
                slug: slug,
                number: number,
                sender: sender,
                review_url: review_url
            };   

            sendmail(user, 'New commits added to pull request', 'src/server/templates/pullReqSync.ejs', 'pull_request', repo, repo_name, number, args);


        },
        star: function(user, starrer, number, repo, repo_name, pull_req_number){
            var args = {
                starrer: starrer,
                number: number
            };

            sendmail(user, 'Your pull request has been starred', 'src/server/templates/starred.ejs', 'star', repo, repo_name, pull_req_number, args);
        },

        unstar: function(user, starrer, number, repo, repo_name, pull_req_number){
            var args = {
                starrer: starrer,
                number: number
            };

            sendmail(user, 'Your pull request has been unstarred', 'src/server/templates/unstarred.ejs', 'star', repo, repo_name, pull_req_number, args);
        },
        new_issue: function(user, sender, issue_number, review_url, repo, repo_name, pull_req_number){

            var args = {
                review_url: review_url,
                issue_number: issue_number,
                sender: sender
            };

            sendmail(user, 'A new issue has been raised', 'src/server/templates/new_issue.ejs', 'issue', repo, repo_name, pull_req_number, args);
        },
        issues_closed: function(user, sender,number, review_url, repo, repo_name, pull_req_number){
            var args = {
                review_url: review_url,
                number: number,
                sender: sender
            };

            sendmail(user, 'All issues have been closed', 'src/server/templates/issue_closed.ejs', 'issue', repo, repo_name, pull_req_number, args);
        }
    };
}();


