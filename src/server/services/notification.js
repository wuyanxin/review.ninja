nodemailer = require('nodemailer');
logger = require('../log');
fs = require('fs');
ejs = require('ejs');


module.exports = function() {

    function sendmail(to,subj,tmpl,args){
        to.forEach(function(user){
           var smtpTransport = nodemailer.createTransport('SMTP', config.server.smtp);
            
            var template = fs.readFileSync(tmpl,'utf-8');
            console.log(template);
            var mailOptions = {
                from: 'RobotNinja ✔ <noreply@review.ninja>',
                to:user.email,
                subject:subj,
                html:ejs.render(template,args)
            };

            console.log(mailOptions);

            // smtpTransport.sendMail(mailOptions, function(error, response) {
               
            //     if (error) {
            //         logger.log(error);
            //     }
            //     smtpTransport.close();
            // });



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
            sendmail(collaborators,'New Commits, you can now review them','../templates/pullReqOpened.ejs',args);
        },
        pull_request_synchronized: function(slug, number, sender, collaborators, review_url) {
            // a pull request you have been reviewing has a new commit
            var args={
                slug:slug,
                number:number,
                sender:sender,
                review_url:review_url
            };   
            sendmail(collaborators,'New Commits, you can now review them','./../templates/pullReqSync.ejs',args);
        },
        star: function(collaborators,starrer,number){

            var args={
                starrer:starrer,
                number:number
            };

            sendmail(collaborators,'Your pull request has been starred','./../templates/starred.ejs',args);

        },

        unstar: function(collaborators,starrer, number){

            var args={
                starrer: starrer,
                number:number
            };

            sendmail(collaborators,'Your pull request has been UNstarred','../templates/unstarred.ejs',args);
        },
        new_issue: function(sender,collaborators,issue_number,review_url){

            var args= {
                review_url: review_url,
                issue_number: issue_number,
                sender:sender
            };

            sendmail(collaborators,'A new issue has just been raised!!','src/server/templates/new_issue.ejs', args);
        },
        issues_close: function(sender,collaborators,number, review_url){

            var args= {
                review_url: review_url,
                number: number,
                sender:sender
            };

            sendmail(collaborators,'All issues have just been closed','src/server/templates/issue_closed.ejs',args);

        },
        new_commit: function(sender,collaborators,reviewer,number){

        }
    };
}();


