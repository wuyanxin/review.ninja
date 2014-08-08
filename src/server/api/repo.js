// module
var github = require('../services/github');
var app = require('../app');
// models
var Repo = require('mongoose').model('Repo');

module.exports = {

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

            if (!repo) {
                return done({
                    code: 404,
                    text: 'Not found'
                });
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

                if (!repo) {
                    return done({
                        code: 404,
                        text: 'Not found'
                    });
                }

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

        github.call({obj: 'repos', fun: 'one', arg: {id: req.args.uuid}, token: req.user.token}, function(err, github_repo) {

            if(!github_repo || err) {
                return done({code: 404, text: 'Not found'});
            }

            if (!github_repo.permissions.admin) {
                return done({
                    code: 403,
                    text: 'Forbidden'
                });
            }

            var webhook_url = 'http://' + config.server.http.host + ':' + config.server.http.port + '/github/webhook';

            Repo.with({uuid: req.args.uuid,token: req.user.token, ninja: true}, function(err, repo) {

                if(!repo || err){
                    return done({code: 404, text: 'Not found'});
                }

                github.call({obj: 'repos', fun: 'createHook', arg: {user: github_repo.owner.login, repo: github_repo.name, name: 'web', config: {url: webhook_url, content_type: 'json'}, events: ['pull_request','issues'], active: true}, token: req.user.token}, function(err, data) {

                    if(err) {
                        // this is no error if the hook already exists when we want to create it
                        errors = JSON.parse(err.message).errors;
                        if(errors.length == 1 && errors.first == 'Hook already exists on this repository') {
                            err = null;
                        }else{
                            return done(err,repo);
                        }
                    }
                    done(err, repo);
                });
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

    rmv: function(req, done) {

        github.call({obj: 'repos', fun: 'one', arg: {id: req.args.uuid}, token: req.user.token}, function(err, github_repo) {
            if(!github_repo) {
                return done({code: 404, text: 'Not found'});
            }

            if (!github_repo.permissions.admin) {
                return done({
                    code: 403,
                    text: 'Forbidden'
                });
            }

            Repo.with({uuid: req.args.uuid,token: req.user.token, ninja: false}, function(err, repo) {
                github.call({obj: 'repos', fun: 'getHooks', arg: {user: github_repo.owner.login, repo: github_repo.name}, token: req.user.token}, function(err, hooks) {
                    
                    if(err){
                        return done(err,hooks);
                    }

                    var webhook_url = 'http://' + config.server.http.host + ':' + config.server.http.port + '/github/webhook';
                    var found = false;
                   
                    hooks.forEach(function(hook) {
                        if(hook.config.url == webhook_url) {
                            found = true;
                            github.call({obj: 'repos', fun: 'deleteHook', arg: {user: github_repo.owner.login, repo: github_repo.name, id: hook.id}, token: req.user.token}, function(err, data) {
                                done(err, repo);
                            });
                        }
                    });

                    if(!found){
                        return done({code: 404, text: 'Not found'});
                    }

                });
            });
        });

    }

};
