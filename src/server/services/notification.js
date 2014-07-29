nodemailer = require('nodemailer');
logger = require('../log');
var fs = require('fs');
var ejs = require('ejs');

function Email (type,slug,number,collaborators,sender,review_url){
    this.type = type;
    slug = slug;
    this.number = number;
    this.collaborators = collaborators;
    this.sender = sender;
    this.review_url= review_url;
    this.subject = null;
    this.body = null;

    //data for email template    
    var data = {
        slug:slug,
        number: number,
        sender: sender,
        review_url:review_url
    };

    if(type == 'open'){
        this.subject = 'New Commits, you can now review them';
        tmpl = fs.readFileSync('../templates/pullReqOpened.ejs', 'utf-8');
        this.body = ejs.render(tmpl,data);

    }else if(type == 'sync'){
        this.subject = 'New Commits, you can now review them';
        tmpl = fs.readFileSync('../templates/pullReqSync.ejs', 'utf-8');
        this.body = ejs.render(tmpl,data);

    }
}


module.exports = function() {

    function sendmail(email){
        to  = email.collaborators;
        to.forEach(function(user){
           var smtpTransport = nodemailer.createTransport('SMTP', config.server.smtp);

            subject = email.subject;
            html = email.body;

            var mailOptions = {
                from: 'RobotNinja ✔ <noreply@review.ninja>',
                to:user.email,
                subject:subject,
                html:html
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
            var email = new Email('open',slug,number,collaborators,sender,review_url);
            sendmail(email);
        },
        pull_request_synchronized: function(slug, number, sender, collaborators, review_url) {
            // a pull request you have been reviewing has a new commit
            var email = new Email('sync',slug,number,collaborators,sender,review_url);
            sendmail(email);
        }
    };
}();


