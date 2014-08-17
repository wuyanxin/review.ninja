// modules
var parse = require('parse-diff');

// models
var Star = require('mongoose').model('Star');

module.exports = {

    get: function(args, pull, done) {

        Star.find({repo: pull.base.repo.id, comm: pull.head.sha}, function(err, stars) {

            pull.stars = [];

            if(!err) {
                pull.stars = stars;
            }

            done(err, pull);

        });
    },
    
    getFiles: function(args, files, done) {
        files.forEach(function(file) {
            file.patch = parse(file.patch);
        });

        done(null, files);
    }
};