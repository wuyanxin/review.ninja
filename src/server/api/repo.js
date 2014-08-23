// module
var github = require('../services/github');
var url = require('../services/url');
var app = require('../app');
// models
var Repo = require('mongoose').model('Repo');
var User = require('mongoose').model('User');

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
            if(typeof done === 'function') {
                done(err, hook);
            }
        });
    }


    return {

        /************************************************************************************************************

        @models

        + Repo, where repo=repo_uuid

        @github

        + repos.one

        ************************************************************************************************************/

        get: function(req, done) {

            github.call({
                obj: 'repos',
                fun: 'one',
                arg: { id: req.args.repo_uuid },
                token: req.user.token
            }, function(err, repo) {

                if (err) {
                    return done(err, repo);
                }

                if(!repo.permissions.pull) {
                    return done({
                        code: 403,
                        text: 'Forbidden'
                    });
                }

                Repo.with({
                    uuid: req.args.repo_uuid
                }, function(err, ninja) {
                    repo.ninja = ninja ? ninja.ninja : null;
                    done(err, repo);
                });

            });

        },

        /************************************************************************************************************

        @models

        + Repo, where repo=repo_uuid

        @github

        + repos.one
        + repos.createHook

    ************************************************************************************************************/

        add: function(req, done) {

            github.call({
                obj: 'repos', 
                fun: 'one', 
                arg: { id: req.args.repo_uuid }, 
                token: req.user.token
            }, function(err, repo) {

                if(err) {
                    return done(err, repo);
                }

                if(!repo.permissions.pull) {
                    return done({
                        code: 403,
                        text: 'Forbidden'
                    });
                }

                Repo.with({ uuid: req.args.repo_uuid }, { token: req.user.token, ninja: true }, function(err, ninja) {
                    repo.ninja = ninja ? ninja.ninja : null;
                    done(err, repo);

                    if(repo.permissions.admin) {
                        createWebhook(repo.owner.login, repo.name, req.user.token);
                    }
                });

                // add to user repos array
                // should this be some sort of transaction?
                User.with({ uuid: req.user.id }, function(err, user) {
                    if(user) {
                        var found = false;
                        user.repos.forEach(function(repo) {
                            if(repo === req.args.repo_uuid) {
                                found = true;
                            }
                        });

                        if(!found) {
                            user.repos.push(req.args.repo_uuid);
                            user.save();
                        }
                    }
                });

            });

        },

        /************************************************************************************************************

        @models

        + Repo, where repo=repo_uuid

        @github

        + repos.one
        + repos.createHook
    review_ninja_npm_dependencies

    ************************************************************************************************************/

        rmv: function(req, done) {

            github.call({
                obj: 'repos', 
                fun: 'one', 
                arg: { id: req.args.repo_uuid }, 
                token: req.user.token
            }, function(err, repo) {

                if(err) {
                    return done(err, repo);
                }

                if (!repo.permissions.admin) {
                    return done({
                        code: 403,
                        text: 'Forbidden'
                    });
                }

                Repo.with({ uuid: req.args.repo_uuid }, { ninja: false }, function(err, ninja) {

                    console.log('*************');
                    console.log(ninja);
                    console.log('*************');

                    repo.ninja = ninja ? ninja.ninja : null;
                    done(err, repo);

                    github.call({
                        obj: 'repos', 
                        fun: 'getHooks', 
                        arg: {
                            user: repo.owner.login, 
                            repo: repo.name
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
                                            user: repo.owner.login, 
                                            repo: repo.name, 
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
            }, function(err, repo) {

                if(err) {
                    return done(err, repo);
                }

                Repo.with({
                    uuid: repo.id
                }, function(err, ninja) {

                    repo.ninja = ninja ? ninja.ninja : null;

                    if(err) {
                        return done(err, repo);
                    }

                    createWebhook(req.args.user, req.args.repo, req.user.token, function(err, hook) {
                        done(err, hook);
                    });
                });
            });
        }
    };
}();
