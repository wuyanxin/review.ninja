nodemailer = require('nodemailer');
logger = require('../log');
fs = require('fs');
ejs = require('ejs');


module.exports = function() {

    function sendmail(to,subj,tmpl,args){
        to.forEach(function(user){
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
            sendmail(collaborators,'New Commits, you can now review them','../templates/pullReqSync.ejs',args);
        }
    };
}();


