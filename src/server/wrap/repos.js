// libraries
var async = require('async');

// models
var User = require('mongoose').model('User');

// modules
var parse = require('parse-diff');

module.exports = {

    compareCommits: function(req, comp, done) {
        comp.files.forEach(function(file) {
            try {
                file.patch = parse(file.patch);
            }
            catch(ex) {
                file.patch = null;
            }
        });

        done(null, comp);
    },

    getCollaborators: function(req, collaborators, done) {
        async.each(collaborators, function(collaborator, callback) {
            User.findOne({ uuid: collaborator.id }, function(err, user) {
                collaborator.ninja = !!user;
                callback(null);
            });
        }, function() {
            done(null, collaborators);
        });
    }
};
