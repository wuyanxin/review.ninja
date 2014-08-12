nodemailer = require('nodemailer');
logger = require('../log');
fs = require('fs');
ejs = require('ejs');

var Conf = require('mongoose').model('Conf');

module.exports = function() {

    function sendmail(user,subj,tmpl,args){

        var smtpTransport = nodemailer.createTransport('SMTP', config.server.smtp);
            
            var template = fs.readFileSync(tmpl,'utf-8');
            var mailOptions = {
                from: 'RobotNinja ✔ <noreply@review.ninja>',
                to:user.email,
                subject:subj,
                html:ejs.render(template,args)
            };

            smtpTransport.sendMail(mailOptions, function(error, response) {
               
                if (error) {
                    logger.log(error);
                }
                smtpTransport.close();
            });

    }

    function checkNotifier(collaborators,repo,notification,done){

                var notified = false;

                Conf.findOne({
                    user: collaborator.uuid,
                    repo: repo.uuid
                }, function(err, conf) {
                    if(conf){

                        if(notification == 'issue'){
                            if(conf.notifications.issue){
                                notified = true;
                            }
                        }else if(notification == 'pull_request'){
                            if(conf.notifications.pull_request){
                                notified = true;
                            }
                        }else if(notification == 'star'){
                             if(conf.notifications.star){
                                notified = true;
                            }                           
                        }

                    }

                    done(notified);

                });

        // for(var index = 0; index<collaborators.length; index++){

        //     var collaborator = collaborators[index];

        //     var notified = false;

        //     Conf.findOne({

        //     }, function(err,conf){

        //         if(conf){

                    
                    
        //         }


        //     })

        // }


    }


    function send(collaborator,args)
    {
        checkNotifier(collaborator,repo,'issue', function(isNotifier)
        {
            if(isNotifier)
            {
                sendmail(collaborator,'A new issue has just been raised!!','src/server/templates/new_issue.ejs', args);
            }
        });   
    }

    return {
        pull_request_opened: function(slug, number, sender, collaborators, review_url) {
            // start a review: send messages to appropriate users
            var args={
                slug:slug,
                number:number,
                sender:sender,
                review_url:review_url
            };

            for(var index =0; index<collaborators.length; index++)
            {
                var collaborator = collaborators[index];
                checkNotifier(collaborator,repo,'pull_request', function(isNotifier)
                {
                    if(isNotifier)
                    {
                        sendmail(collaborator,'New Commits, you can now review them','../templates/pullReqOpened.ejs',args);
                    }
                });

            }

        },
        pull_request_synchronized: function(slug, number, sender, collaborators, review_url) {
            // a pull request you have been reviewing has a new commit
            var args={
                slug:slug,
                number:number,
                sender:sender,
                review_url:review_url
            };   

            for(var index =0; index<collaborators.length; index++)
            {
                var collaborator = collaborators[index];
                checkNotifier(collaborator,repo,'pull_request', function(isNotifier)
                {
                    if(isNotifier)
                    {
                        sendmail(collaborator,'New Commits, you can now review them','./../templates/pullReqSync.ejs',args);
                    }
                });

            }

        },
        star: function(collaborators,starrer,number){

            var args={
                starrer:starrer,
                number:number
            };

            for(var index =0; index<collaborators.length; index++)
            {
                var collaborator = collaborators[index];
                checkNotifier(collaborator,repo,'star', function(isNotifier)
                {
                    if(isNotifier)
                    {
                        sendmail(collaborator,'Your pull request has been starred','./../templates/starred.ejs',args);
                    }
                });

            }

        },

        unstar: function(collaborators,starrer, number){

            var args={
                starrer: starrer,
                number:number
            };

            for(var index =0; index<collaborators.length; index++)
            {
                var collaborator = collaborators[index];
                checkNotifier(collaborator,repo,'star', function(isNotifier)
                {
                    if(isNotifier)
                    {
                        sendmail(collaborator,'Your pull request has been UNstarred','../templates/unstarred.ejs',args);
                    }
                });

            }

        },
        new_issue: function(sender,collaborators,issue_number,review_url, repo){
            console.log('new issue');
            var args= {
                review_url: review_url,
                issue_number: issue_number,
                sender:sender
            };


            for(var index =0; index<collaborators.length; index++)
            {
                var collaborator = collaborators[index];
                checkNotifier(collaborator,repo,'issue', function(isNotifier)
                {
                    if(isNotifier)
                    {
                        sendmail(collaborator,'A new issue has just been raised!!','src/server/templates/new_issue.ejs', args);
                    }
                });

            }

        },
        issues_close: function(sender,collaborators,number, review_url){

            var args= {
                review_url: review_url,
                number: number,
                sender:sender
            };


            for(var index =0; index<collaborators.length; index++)
            {
                var collaborator = collaborators[index];
                checkNotifier(collaborator,repo,'issue', function(isNotifier)
                {
                    if(isNotifier)
                    {
                        sendmail(collaborator,'All issues have just been closed','src/server/templates/issue_closed.ejs',args);
                    }
                });

            }

        }
    };
}();


