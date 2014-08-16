// modules
var parse = require('parse-diff');
// models
var Repo = require('mongoose').model('Repo');

module.exports = {

    one: function(args, repo, done) {

        if (!repo.permissions.pull) {
            return done({
                code: 403,
                text: 'Forbidden'
            });
        }

        Repo.with({
            uuid: repo.id
        }, function(err, repo) {
            done(err, repo);
        });
    },
    
    compareCommits: function(args, comp, done) {
        comp.files.forEach(function(file) {
            file.patch = parse(file.patch);
        });

        done(null, comp);
    }
};