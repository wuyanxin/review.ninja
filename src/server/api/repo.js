'use strict';
// services
var github = require('../services/github');
var keenio = require('../services/keenio');
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
            }, {}, function(err, obj) {
                if(!err) {
                    keenio.addEvent('repo:setComment', req.args);
                }
                done(err, obj);
            });
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
            }, {}, function(err, obj) {
                if (!err) {
                    keenio.addEvent('repo:setThreshold', req.args);
                }
                done(err, obj);
            });
        });
    }

};
