// module
var github = require('../services/github');
var url = require('../services/url');
// models
var User = require('mongoose').model('User');

module.exports = {

    get: function(req, done) {
        github.call({
            obj: 'repos',
            fun: 'getHooks',
            arg: {
                user: req.args.user,
                repo: req.args.repo
            },
            token: req.user.token
        }, function(err, hooks) {
            var hook;
            if(!err) {
                hooks.forEach(function(webhook) {
                    if(webhook.config.url.indexOf(url.baseWebhook) > -1) {
                        hook = webhook;
                    }
                });
            }

            // now we will have to check two things:
            // 1) webhook user still has push access to this repo
            // 2) token is still valid

            done(err, hook);
        });
    },

    create: function(req, done) {
        User.findOne({uuid: req.args.user_uuid}, function(err, user) {

            if(!user) {
                return done(err);
            }

            github.call({
                obj: 'repos',
                fun: 'createHook',
                arg: { 
                    user: req.args.user,
                    repo: req.args.repo,
                    name: 'web',
                    config: { url: url.webhook(user._id), content_type: 'json' },
                    events: ['pull_request','issues', 'issue_comment'],
                    active: true
                },
                token: req.user.token
            }, done);
        });
    }
};
