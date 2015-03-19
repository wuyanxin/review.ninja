'use strict';
// services
var github = require('../services/github');
// models
var Repo = require('mongoose').model('Repo');

module.exports = {

    get: function(req, done) {
        Repo.findOne({repo: req.args.repo_uuid}, function(err, repo) {
            if(repo) {
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
            }, {}, done);
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
            }, {}, done);
        });
    }

};
