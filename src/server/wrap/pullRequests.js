// modules
var async = require('async');
var parse = require('parse-diff');

// models
var Star = require('mongoose').model('Star');
var Settings = require('mongoose').model('Settings');

module.exports = {

    get: function(req, pull, done) {

        Star.find({sha: pull.head.sha, repo: pull.base.repo.id}, function(err, stars) {

            pull.stars = [];

            if(!err) {
                pull.stars = stars;
            }

            done(err, pull);
        });
    },
    
    getFiles: function(req, files, done) {
        files.forEach(function(file) {
            try {
                file.patch = parse(file.patch);
            }
            catch(ex) {
                file.patch = null;
            }
        });

        done(null, files);
    },

    getAll: function(req, pulls, done) {

            var repo;

            try {
                repo = pulls[0].base.repo.id;
            }
            catch(ex) {
                repo = null;
            }

            Settings.with({
                user: req.user.id,
                repo: repo
            }, function(err, settings) {

                // set the watched pulls
                if(settings) {
                    pulls.forEach(function(pull) {
                        pull.watched = false;

                        settings.watched.forEach(function(watch) {
                            var re = RegExp(watch, 'g');
                            if(re.exec(pull.base.ref) || re.exec(pull.head.ref)) {
                                pull.watched = true;
                            }
                        });
                    });
                }

                // set the stars
                async.each(pulls, function(pull, call) {
                    Star.find({sha: pull.head.sha, repo: pull.base.repo.id}, function(err, stars) {
                        pull.stars = [];
                        if(!err) {
                            pull.stars = stars;
                        }
                        return call(null);
                    });
                }, function() {
                    done(err, pulls);
                });
            });
    }
};
