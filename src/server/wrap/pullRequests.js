// modules
var async = require('async');
var parse = require('parse-diff');

// models
var Star = require('mongoose').model('Star');
var Settings = require('mongoose').model('Settings');

module.exports = {

    get: function(req, pull, done) {

        Star.find({repo: pull.base.repo.id, comm: pull.head.sha}, function(err, stars) {

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

            Settings.findOne({
                user: req.user.id,
                repo: repo
            }, function(err, settings) {

                // set the watched pulls
                if(settings) {
                    pulls.forEach(function(pull) {
                        pull.watched = false;
                        for(var i=0; i<settings.watched.length; i++) {
                            var re = RegExp(settings.watched[i], 'g');
                            if(re.exec(pull.base.ref) || re.exec(pull.head.ref)) {
                                pull.watched = true;
                                break;
                            }
                        }
                    });
                }

                // set the stars
                async.each(pulls, function(pull, call) {
                    Star.find({repo: pull.base.repo.id, comm: pull.head.sha}, function(err, stars) {
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
