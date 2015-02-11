// libraries
var async = require('async');

// models
var User = require('mongoose').model('User');

// modules
var parse = require('parse-diff');

// services
var karma = require('../services/karma');

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
                karma.rankForUserAndRepo(collaborator.login, req.args.arg.repo, function(obj) {
                    collaborator.karma = obj;
                    collaborator.ninja = !!user;
                    callback(null);
                });
            });
        }, function() {
            done(null, collaborators);
        });
    }
};
