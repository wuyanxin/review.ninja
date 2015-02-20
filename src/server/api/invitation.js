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

        var template = fs.readFileSync('./src/server/templates/invite.ejs', 'utf-8');

        var mailOptions = {
            from: 'ReviewNinja <noreply@review.ninja>',
            to: null,
            subject: req.user.login + ' invited you to try ReviewNinja!',
            html: ejs.render(template, {
                user: req.args.user,
                repo: req.args.repo,
                inviter: req.user.login,
                url: url.reviewRepo(req.args.user, req.args.repo),
                baseUrl: url.baseUrl
            })
        };

        transporter.sendMail(mailOptions, function(err, res) {
            if(!err) {
                transporter.close();
            }
            done(err, res);
        });
    }
};
