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
        collaborators.forEach(function(collaborator) {
            User.findOne({ uuid: collaborator.id }, function(err, user) {
                if(!err) {
                    collaborator.reviewNinjaUser = !!user;
                }
            });
        });
        done(null, collaborators);
    }
};
