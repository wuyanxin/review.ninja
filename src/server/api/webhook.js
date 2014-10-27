// module
var url = require('../services/url');
var github = require('../services/github');
var webhook = require('../services/webhook');
// models
var User = require('mongoose').model('User');

module.exports = {

    get: function(req, done) {

        webhook.get(req.args.user, req.args.repo, req.user.token,
            function(err, hook) {

                // now we will have to check two things:
                // 1) webhook user still has push access to this repo
                // 2) token is still valid
                // -> if one of these conditions is not met we will
                //    delete the webhook

                // if(hook) {

                // }

                done(err, hook);
            }
        );
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
                    events: ['pull_request', 'issues', 'issue_comment'],
                    active: true
                },
                token: req.user.token
            }, done);
        });
    }
};
