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
                    if(webhook.config.url === url.webhook) {
                        hook = webhook;
                    }
                });
            }

            done(err, hook);
        });
    },

    create: function(req, done) {
        github.call({
            obj: 'repos',
            fun: 'createHook',
            arg: { 
                user: req.args.user,
                repo: req.args.repo,
                name: 'web',
                config: { url: url.webhook, content_type: 'json' },
                events: ['pull_request','issues', 'issue_comment'],
                active: true
            },
            token: req.user.token
        }, done);
    }
};
