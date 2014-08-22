// module
var github = require('../services/github');
var url = require('../services/url');
var app = require('../app');
// models
var Repo = require('mongoose').model('Repo');

module.exports = function() {

    function createWebhook(user, repo, token, done) {
        github.call({
            obj: 'repos',
            fun: 'createHook',
            arg: { 
                user: user,
                repo: repo,
                name: 'web',
                config: { url: url.webhook, content_type: 'json' },
                events: ['pull_request','issues', 'issue_comment'],
                active: true
            },
            token: token
        }, function(err, hook) {
            if(done) {
                done(err, hook);
            }
        });
    }


    return {

        /************************************************************************************************************

        @models

        + Repo, where repo=repo-uuid

        @github

        + repos.one

        ************************************************************************************************************/

        get: function(req, done) {

            github.call({
                obj: 'repos',
                fun: 'one',
                arg: {
                    id: req.args.uuid
                },
                token: req.user.token
            }, function(err, repo) {

                if (err) {
                    return done(err, repo);
                }

                if (!repo.permissions.pull) {
                    return done({
                        code: 403,
                        text: 'Forbidden'
                    });
                }

                Repo.with({
                    uuid: req.args.uuid
                }, function(err, repo) {
                    done(err, repo);
                });

            });

        },

        /************************************************************************************************************

        @models

        + Repo, where repo=repo-uuid

        @github

        + repos.one
        + repos.createHook

    ************************************************************************************************************/

        add: function(req, done) {

            github.call({
                obj: 'repos', 
                fun: 'one', 
                arg: { id: req.args.uuid }, 
                token: req.user.token
            }, function(err, github_repo) {

                if(err) {
                    return done(err, github_repo);
                }

                if (!github_repo.permissions.admin) {
                    return done({
                        code: 403,
                        text: 'Forbidden'
                    });
                }

                Repo.with({ uuid: req.args.uuid }, { token: req.user.token, ninja: true }, function(err, repo) {
                    done(err, repo);
                    createWebhook(github_repo.owner.login, github_repo.name, req.user.token);
                });

            });

        },

        /************************************************************************************************************

        @models

        + Repo, where repo=repo-uuid

        @github

        + repos.one
        + repos.createHook
    review_ninja_npm_dependencies

    ************************************************************************************************************/

        rmv: function(req, done) {

            github.call({
                obj: 'repos', 
                fun: 'one', 
                arg: { id: req.args.uuid }, 
                token: req.user.token
            }, function(err, github_repo) {

                if(err) {
                    return done(err, github_repo);
                }

                if (!github_repo.permissions.admin) {
                    return done({
                        code: 403,
                        text: 'Forbidden'
                    });
                }

                Repo.with({ uuid: req.args.uuid }, { ninja: false }, function(err, repo) {

                    done(err, repo);

                    github.call({
                        obj: 'repos', 
                        fun: 'getHooks', 
                        arg: {
                            user: github_repo.owner.login, 
                            repo: github_repo.name
                        }, 
                        token: req.user.token
                    }, function(err, hooks) {
                        
                        if(!err) {
                            hooks.forEach(function(hook) {
                                if (hook.config.url === url.webhook) {
                                    github.call({
                                        obj: 'repos', 
                                        fun: 'deleteHook', 
                                        arg: {
                                            user: github_repo.owner.login, 
                                            repo: github_repo.name, 
                                            id: hook.id
                                        }, 
                                        token: req.user.token
                                    }, function(err, data) {

                                    });
                                }
                            });
                        }

                    });
                });
            });

        },

        getHook: function(req, done) {
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

        createHook: function(req, done) {
            github.call({
                obj: 'repos',
                fun: 'get',
                arg: {
                    user: req.args.user,
                    repo: req.args.repo
                },
                token: req.user.token
            }, function(err, github_repo) {

                if(err) {
                    return done(err, github_repo);
                }

                Repo.with({
                    uuid: github_repo.id
                }, function(err, repo) {

                    if(err) {
                        return done(err, repo);
                    }

                    createWebhook(req.args.user, req.args.repo, repo.token, done);
                });
            });
        }
    };
}();
