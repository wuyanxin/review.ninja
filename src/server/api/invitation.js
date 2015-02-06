// libraries
var nodemailer = require('nodemailer');
var fs = require('fs');
var ejs = require('ejs');
var smtpTransport = require('nodemailer-smtp-transport');
var sendmailTransport = require('nodemailer-sendmail-transport');

// services
var url = require('../services/url');

module.exports = {
    invite: function(req, done) {
        var transporter = null;
        if(config.server.smtp.enabled) {
            transporter = nodemailer.createTransport(smtpTransport(config.server.smtp));
        }
        transporter = nodemailer.createTransport(sendmailTransport());

        var template = fs.readFileSync('src/server/templates/invite.ejs', 'utf-8');
        var args = {
            filename: template,
            user: req.args.user,
            repo: req.args.repo,
            url: 'url',
            inviter: req.args.invitee
        };
        var mailOptions = {
            from: 'ReviewNinja <noreply@review.ninja>',
            to: req.args.email,
            subject: 'You are invited to ReviewNinja',
            html: ejs.render(template, args)
        };
        transporter.sendMail(mailOptions, function(err, response) {
            if (err) {
                return;
            }
            transporter.close();
        });
    }
};
