// modules
var async = require('async');
var github = require('../services/github');

module.exports = {

    repos: function(req, results, done) {

        var repos = [];

        async.each(results.items, function(result, call) {

            github.call({
                obj: 'repos',
                fun: 'one',
                arg: { id: result.id },
                token: req.user.token
            }, function(err, repo) {

                if(repo && repo.permissions.push) {
                    repos.push(repo);
                }

                return call(null);
            });

        }, function() {
            done(null, repos);
        });
    }
};
