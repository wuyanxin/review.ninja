'use strict';
// services
var github = require('../services/github');
// models
var Repo = require('mongoose').model('Repo');
var merge = require('merge');

module.exports = {

    get: function(req, done) {
        Repo.findOne({repo: req.args.repo_uuid}, function(err, repo) {
            if(err || repo) {
                return done(err, repo);
            }

            Repo.create({
                repo: req.args.repo_uuid
            }, done);
        });
    },

    setComment: function(req, done) {
        github.call({
            obj: 'repos',
            fun: 'one',
            arg: { id: req.args.repo_uuid },
            token: req.user.token
        }, function(err, repo) {
            if(err) {
                return done(err);
            }
            if(!repo.permissions.admin) {
                return done({msg: 'Insufficient permissions'});
            }
            Repo.findOneAndUpdate({
                repo: req.args.repo_uuid
            }, {
                comment: req.args.comment
            }, {new: true}, done);
        });
    },

    setThreshold: function(req, done) {
        github.call({
            obj: 'repos',
            fun: 'one',
            arg: { id: req.args.repo_uuid },
            token: req.user.token
        }, function(err, repo) {
            if(err) {
                return done(err);
            }
            if(!repo.permissions.admin) {
                return done({msg: 'Insufficient permissions'});
            }
            Repo.findOneAndUpdate({
                repo: req.args.repo_uuid
            }, {
                threshold: req.args.threshold
            }, {new: true}, done);
        });
    },

    setSlack: function(req, done) {
        github.call({
            obj: 'repos',
            fun: 'one',
            arg: { id: req.args.repo_uuid },
            token: req.user.token
        }, function(err, repo) {
            if(err) {
                return done(err);
            }
            if(!repo.permissions.admin) {
                return done({msg: 'Insufficient permissions'});
            }

            if(req.args.slack && req.args.slack.channel && req.args.slack.channel.charAt(0) !== '#') {
                req.args.slack.channel = '#' + req.args.slack.channel;
            }

            Repo.findOneAndUpdate({
                repo: req.args.repo_uuid
            }, {
                slack: req.args.slack
            }, {new: true}, done);
        });
    },

    getSlack: function(req, done) {
        Repo.findOneAndUpdate({
            repo: req.args.repo_uuid
        }, {}, {new: true, upsert: true}).select('+slack.token').exec(function(err, repo) {
            if (err) {
                return done(err, null);
            }
            repo.slack.token = !!repo.slack.token;
            done(err, repo.slack);
        });
    }

};
