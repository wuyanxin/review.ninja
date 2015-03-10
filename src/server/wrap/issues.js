'use strict';
// modules
var async = require('async');
var parse = require('parse-diff');

// services
var github = require('../services/github');
var userService = require('../services/user');

module.exports = {
    getComments: function(req, issueComments, done) {
        async.each(issueComments, function(comment, callback) {
            userService.ghost(comment.user, req.args.token, function(err, user) {
                if(!err) {
                    comment.user = user;
                }
                callback(null);
            });
        }, function() {
            done(null, issueComments);
        });
    },
    repoIssues: function(req, repoIssues, done) {
        async.each(repoIssues, function(comment, callback) {
            userService.ghost(comment.user, req.args.token, function(err, user) {
                if(!err) {
                    comment.user = user;
                }
                callback(null);
            });
        }, function() {
            done(null, repoIssues);
        });
    }
};
