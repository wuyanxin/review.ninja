// models
var Milestone = require('mongoose').model('Milestone');

// modules
var github = require('../services/github');

module.exports = {

    get: function(user, repo, repo_uuid, number, token, done) {
        Milestone.findOne({
            pull: number,
            repo: repo_uuid
        }, function(err, mile) {

            if(err) {
                return done(err);
            }

            // check if milestone still exists
            github.call({
                obj: 'issues',
                fun: 'getMilestone',
                arg: {
                    user: user,
                    repo: repo,
                    number: mile ? mile.number : null
                },
                token: token
            }, function(err, githubMile) {
                if(!err && mile.id === githubMile.id) {
                    return done(err, githubMile);
                }

                // create milestone if non-existant
                github.call({
                    obj: 'issues',
                    fun: 'createMilestone',
                    arg: {
                        user: user,
                        repo: repo,
                        title: config.milestone_prefix + 'ReviewNinja PR #' + number
                    },
                    token: token
                }, function(err, mile) {
                    if(err) {
                        return done(err);
                    }

                    Milestone.create({
                        id: mile.id,
                        pull: number,
                        repo: repo_uuid,
                        number: mile.number
                    }, done);
                });
            });
        });
    },

    close: function(user, repo, repo_uuid, number, token) {
        Milestone.findOne({
            pull: number,
            repo: repo_uuid
        }, function(err, mile) {
            if(!err && mile) {
                github.call({
                    obj: 'issues',
                    fun: 'getMilestone',
                    arg: {
                        user: user,
                        repo: repo,
                        number: mile.number
                    },
                    token: token
                }, function(err, githubMile) {
                    if(!err && mile.id === githubMile.id) {
                        github.call({
                            obj: 'issues',
                            fun: 'updateMilestone',
                            arg: {
                                user: user,
                                repo: repo,
                                number: githubMile.number,
                                title: githubMile.title,
                                state: 'closed'
                            },
                            token: token
                        });
                    }
                });
            }
        });
    }
};
