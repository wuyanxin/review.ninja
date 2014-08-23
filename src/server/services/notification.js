var nodemailer = require('nodemailer');
var fs = require('fs');
var ejs = require('ejs');
var github = require('./github');

var Settings = require('mongoose').model('Settings');
var User = require('mongoose').model('User');

module.exports = function() {

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

    function get_primary_email(token, done) {

        github.call({
            obj: 'user',
            fun: 'getEmails',
            arg : {
                headers: {
                    'accept': 'application/vnd.github.v3+json'
                }
            },
            token: token
        }, function(err, emails) {

            var primary = null;
            for(var key=0; key < emails.length; key++) {

                if(emails[key].primary && emails[key].verified) {
                    primary = emails[key];
                    break;
                }
            }

            done(err,primary);
        });
    }


    var eventType = {

        pull_request_opened: 'pull_request',

        pull_request_synchronized: 'pull_request',

        star: 'star',

        unstar: 'unstar',

        new_issue: 'issue',

        closed_issue: 'issue'
    };

    var notification_args = {

        pull_request_opened: {
            subject:'A new pull request is ready for review',
            template:'src/server/templates/pullReqOpened.ejs'
        },

        pull_request_synchronized: {
            subject:  'New commits added to pull request',
            template: 'src/server/templates/pullReqSync.ejs'
        },

        star: {
            subject: 'Your pull request has been starred',
            template: 'src/server/templates/starred.ejs'
        },

        unstar: {
            subject: 'Your pull request has been unstarred',
            template: 'src/server/templates/unstarred.ejs'
        },

        new_issue: {
            subject: 'A new issue has been raised',
            template: 'src/server/templates/new_issue.ejs'
        },

        closed_issue: {
            subject: 'All issues have been closed',
            template: 'src/server/templates/issue_closed.ejs'
        }

    };

    return {

        sendmail: function (user, notification_type, repo, repo_name, pull_req_number, args) {

            get_pull_request(pull_req_number, user, repo_name, repo.token, function(err, pull) {

                if(err) {
                    return;
                }

                if(pull.state!='open') {
                    return;
                }

                get_collaborators(user,repo_name,repo.token, function(err, collaborators) {

                    if(err) {
                        return;
                    }

                    collaborators.forEach(function(collaborator){

                        get_primary_email(collaborator.token, function(err, email) {

                            if(err || !email) {
                                return;
                            }

                            Settings.findOne({
                                user: collaborator.uuid,
                                repo: repo.uuid
                            }, function(err, settings) {

                                if(err || !settings || !settings.watched){
                                    return;
                                }

                                var watching = false;

                                for(var key=0; key<settings.watched.length; key++){

                                    var watch_branch = settings.watched[key];
                                    var re = new RegExp(watch_branch, 'g');

                                    if(re.exec(pull.base.ref) || re.exec(pull.head.ref)){
                                        watching = true;
                                        break;
                                    }
                                }

                                if( watching && ((eventType[notification_type] === 'star' && settings.notifications.star) || 
                                    (eventType[notification_type] === 'issue' && settings.notifications.issue) || 
                                    (eventType[notification_type] === 'pull_request' && settings.notifications.pull_request)) ){

                                    var smtpTransport = nodemailer.createTransport('SMTP', config.server.smtp);

                                    var template = fs.readFileSync(notification_args[notification_type].template, 'utf-8');

                                    var mailOptions = {
                                        from: 'Review Ninja <noreply@review.ninja>',
                                        to: collaborator.email,
                                        subject: notification_args[notification_type].subject,
                                        html: ejs.render(template, args)
                                    };

                                    smtpTransport.sendMail(mailOptions, function(err, response) {
                                       
                                        if (err) {
                                            return;
                                        }

                                        smtpTransport.close();
                                    });
                                }                
                            });

                        });
                    });
                });
            });
        }
    };
}();


