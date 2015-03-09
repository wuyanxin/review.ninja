'use strict';
exports.id = '1.1.0';

// modules
var async = require('async');

// services
var github = require('../services/github');

exports.up = function (done) {

    var Users = this.db.collection('users');
    var Milestones = this.db.collection('milestones');

    var tokens = {};

    Users.find({}).toArray(function(err, users) {
        if(err) {
            return done(err);
        }

        users.forEach(function(user) {
            if(user.repos) {
                user.repos.forEach(function(repo) {
                    if(!tokens[repo]) {
                        tokens[repo] = [];
                    }
                    tokens[repo].push(user.token);
                });
            }
        });

        Milestones.find({}).toArray(function(err, miles) {
            if(err) {
                return done(err);
            }

            async.each(miles, function(oldMile, callback) {

                var newMile;
                var _tokens = tokens[oldMile.repo] || [];

                async.eachSeries(_tokens, function(token, callback) {

                    if(newMile) {
                        return callback();
                    }

                    github.call({
                        obj: 'repos',
                        fun: 'one',
                        arg: {id: oldMile.repo},
                        token: token
                    }, function(err, repo) {

                        if(err) {
                            return callback();
                        }

                        github.call({
                            obj: 'issues',
                            fun: 'getMilestone',
                            arg: {
                                user: repo.owner.login,
                                repo: repo.name,
                                number: oldMile.number
                            },
                            token: token
                        }, function(err, githubMile) {

                            if(!err) {
                                newMile = {
                                    id: githubMile.id,
                                    pull: oldMile.pull,
                                    repo: oldMile.repo,
                                    number: oldMile.number
                                };
                            }

                            callback();
                        });
                    });

                }, function(err) {

                    if(newMile) {
                        Milestones.update(oldMile, {$set: newMile}, callback);
                    } else {
                        Milestones.remove(oldMile, callback);
                    }
                });

            }, done);
        });
    });
};
