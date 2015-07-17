'use strict';

// modules
var async = require('async');
var parse = require('parse-diff');

// services
var github = require('../services/github');
var pullRequest = require('../services/pullRequest');

// models
var Star = require('mongoose').model('Star');
var Settings = require('mongoose').model('Settings');

module.exports = {
    get: function(req, pull, done) {
        Settings.findOne({
            user: req.user.id,
            repo: pull.base.repo.id
        }, function(err, settings) {
            if(!err) {
                pull.watched = !settings ? true : pullRequest.isWatched(pull, settings);
            }
            done(null, pull);
        });
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

            if(err) {
                return done(null, pulls);
            }

            // set watched
            pulls.forEach(function(pull) {
                pull.watched = !settings ? true : pullRequest.isWatched(pull, settings);
            });

            done(null, pulls);
        });
    }
};
