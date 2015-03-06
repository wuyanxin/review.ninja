// modules
var fs = require('fs');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var sendmailTransport = require('nodemailer-sendmail-transport');

// services
var url = require('../services/url');

module.exports = function() {

    function buildTransporter() {
        if(config.server.smtp.enabled) {
            return nodemailer.createTransport(smtpTransport(config.server.smtp));
        }
        return nodemailer.createTransport(sendmailTransport());
    }

    function sendmail(opts, done) {
        var transporter = buildTransporter();

        transporter.sendMail(opts, function(err, res) {
            if(!err) {
                transporter.close();
            }

            if(typeof done === 'function') {
                done(err, res);
            }
        });
    }

    return {
        send: function(to, login, user, repo, done) {
            var template = fs.readFileSync('./src/server/templates/invite.ejs', 'utf-8');

            sendmail({
                from: 'ReviewNinja <noreply@review.ninja>',
                to: to,
                subject: login + ' invited you to try ReviewNinja!',
                html: ejs.render(template, {
                    user: user,
                    repo: repo,
                    inviter: login,
                    url: url.reviewRepo(user, repo),
                    baseUrl: url.baseUrl
                })
            }, function(err, res) {
                err = err ? { type: 'failed' } : null;
                done(err, res);
            });
        }
    };
}();
