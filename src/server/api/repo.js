
var github = require('../services/github');

var Repo = require('../documents/repo.js').Repo;

module.exports = {

/************************************************************************************************************

    Models:

    + Repo, where repo=repo-uuid

    ************************************************************************************************************/

    get: function(req, done) {

        github.call({obj: 'repos', fun: 'one', arg: {id: req.args.uuid}, token: req.user.token}, function(err, repo) {

            if(!repo) {
                return done({code: 404, text: 'Not found'});
            }

            if(!repo.permissions.pull) {
                return done({code: 403, text: 'Forbidden'});
            }

            Repo.with({uuid: req.args.uuid}, function(err, repo) {

                if(!repo) {
                    return done({code: 404, text: 'Not found'});
                }

                done(err, repo);

            });

        });

    },

/************************************************************************************************************

    Models:

    + Repo, where repo=repo-uuid

    ************************************************************************************************************/

    add: function(req, done) {

        github.call({obj: 'repos', fun: 'one', arg: {id: req.args.uuid}, token: req.user.token}, function(err, repo) {

            if(!repo) {
                return done({code: 404, text: 'Not found'});
            }

            if(!repo.permissions.admin) {
                return done({code: 403, text: 'Forbidden'});
            }

            var webhook_url = 'http://' + config.server.http.host + ':' + config.server.http.port + '/github/webhook';

            Repo.with({uuid: req.args.uuid}, {token: req.user.token, ninja: true}, function(err, repo) {
                github.call({obj: 'repos', fun: 'one', arg: {id: repo.uuid}, token: req.user.token}, function(err, github_repo) {
                    github.call({obj: 'repos', fun: 'createHook', arg: {user: github_repo.owner.login, repo: github_repo.name, name: 'web', config: {url: webhook_url, content_type: 'json'}, events: ['pull_request'], active: true}, token: req.user.token}, function(err, data) {
                        if(err) {
                            // this is no error if the hook already exists when we want to create it
                            errors = JSON.parse(err.message).errors;
                            if(errors.length == 1 && errors.first.message == 'Hook already exists on this repository') {
                                err = null;
                            }
                        }
                        done(err, repo);
                    });
                });
            });

        });

    },

/************************************************************************************************************

    Models:

    + Repo, where repo=repo-uuid

    ************************************************************************************************************/

    rmv: function(req, done) {

        github.call({obj: 'repos', fun: 'one', arg: {id: req.args.uuid}, token: req.user.token}, function(err, repo) {

            if(!repo) {
                return done({code: 404, text: 'Not found'});
            }

            if(!repo.permissions.admin) {
                return done({code: 403, text: 'Forbidden'});
            }

            Repo.with({uuid: req.args.uuid}, {token: req.user.token, ninja: false}, function(err, repo) {
                github.call({obj: 'repos', fun: 'one', arg: {id: repo.uuid}, token: req.user.token}, function(err, github_repo) {
                    github.call({obj: 'repos', fun: 'getHooks', arg: {user: github_repo.owner.login, repo: github_repo.name}, token: req.user.token}, function(err, hooks) {
                        var webhook_url = 'http://' + config.server.http.host + ':' + config.server.http.port + '/github/webhook';
                        hooks.forEach(function(hook) {
                            if(hook.config.url == webhook_url) {
                                github.call({obj: 'repos', fun: 'deleteHook', arg: {user: github_repo.owner.login, repo: github_repo.name, id: hook.id}, token: req.user.token}, function(err, data) {
                                    done(err, repo);
                                });
                            }
                        });
                    });
                });
            });
        });

}

};
