// modules
var fs = require('fs');
var ejs = require('ejs');

// services
var url = require('../services/url');
var mail = require('../services/mail');
var github = require('../services/github');

module.exports = {
    invite: function(req, done) {

        var template = fs.readFileSync('./src/server/templates/invite.ejs', 'utf-8');

        github.call({
            obj: 'user',
            fun: 'getFrom',
            arg: {user: req.args.invitee},
            token: req.user.token
        }, function(err, user) {
            if(err) {
                return done(true);
            }

            if(!user.email) {
                return done(true);
            }

            mail.send({
                from: 'ReviewNinja <noreply@review.ninja>',
                to: user.email,
                subject: req.user.login + ' invited you to try ReviewNinja!',
                html: ejs.render(template, {
                    user: req.args.user,
                    repo: req.args.repo,
                    inviter: req.user.login,
                    url: url.reviewRepo(req.args.user, req.args.repo),
                    baseUrl: url.baseUrl
                })
            }, done);

        });
    }
};
