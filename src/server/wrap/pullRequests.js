// modules
var async = require('async');
var parse = require('parse-diff');

// services
var pullRequest = require('../services/pullRequest');

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

        Settings.findOne({
            user: req.user.id,
            repo: repo
        }, function(err, settings) {
            pullRequest.setWatched(pulls, settings);

            // set the stars
            async.each(pulls, function(pull, callback) {
                Star.find({sha: pull.head.sha, repo: pull.base.repo.id}, function(err, stars) {
                    pull.stars = [];
                    if(!err) {
                        pull.stars = stars;
                    }
                    return callback(null);
                });
            }, function() {
                done(err, pulls);
            });
        });
    }
};
