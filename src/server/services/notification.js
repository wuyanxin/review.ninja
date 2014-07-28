nodemailer = require('nodemailer');
logger = require('../log');

module.exports = function() {

    function sendmail(to, subject, text) {
        to.forEach(function(user) {
            var smtpTransport = nodemailer.createTransport('SMTP', config.server.smtp);

            var mailOptions = {
                from: 'RobotNinja ✔ <noreply@review.ninja>',
                to: user.email, //to be retrieved from user
                subject: subject,
                text: text
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
            sendmail(collaborators,
                'New commits, you can now review them :)',
                'pull request #' + number + ' opened for ' + slug + ' by ' + sender.login + ', review at: ' + review_url
            );
        },
        pull_request_synchronized: function(slug, number, sender, collaborators, review_url) {
            // a pull request you have been reviewing has a new commit
            sendmail(collaborators,
                'New commits, you can now review them :)',
                'pull request #' + number + ' synchronized for ' + slug + ' by ' + sender.login + ', review at: ' + review_url
            );
        }
    };
}();
