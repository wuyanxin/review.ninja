var async = require('async');
var express = require('express');

var github = require('../services/github');

//////////////////////////////////////////////////////////////////////////////////////////////
// Tool controller
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.all('/vote/:uuid/:comm', function(req, res) {


    var Tool = require('mongoose').model('Tool');
    var Repo = require('mongoose').model('Repo');
    var Star = require('mongoose').model('Star');

    var uuid = req.params.uuid;
    var comm = req.params.comm;
    var vote = req.body;


    if (!vote) {
        return res.send(400, 'Bad request, no data sent');
    }

    if (vote.star === undefined || vote.star === null) {
        res.send(400, 'Post data did not include star');
        return;
    }

    Tool.findById(uuid, function(err, tool) {

        if (err) {
            return res.send(500);
        }

        if (!tool) {
            return res.send(404, 'Tool not found');
        }

        if (tool.enabled) {
            Repo.findOne({
                'uuid': tool.repo
            }, function(err, repo) {

                if (err || !repo) {
                    return res.send(404, 'Repo not found');
                }

                github.call({
                    obj: 'repos',
                    fun: 'one',
                    arg: {
                        id: repo.uuid
                    },
                    token: repo.token
                }, function(err, grepo) {

                    var repoUser = grepo.owner.login;
                    var repoName = grepo.name;

                    github.call({
                        obj: 'repos',
                        fun: 'getCommit',
                        arg: {
                            user: repoUser,
                            repo: repoName,
                            sha: comm
                        },
                        token: repo.token
                    }, function(err, comm) {

                        if (err) {
                            return res.send(err.code, err.message.message);
                        }

                        var queue = [];

                        if (vote.comments) {
                            vote.comments.forEach(function(c) {
                                queue.push(function(done) {
                                    github.call({
                                        obj: 'repos',
                                        fun: 'createCommitComment',
                                        arg: {
                                            user: repoUser,
                                            repo: repoName,
                                            sha: comm.sha,
                                            commit_id: comm.sha,
                                            body: c.body,
                                            path: c.path,
                                            line: c.line
                                        },
                                        token: repo.token
                                    }, done);
                                });
                            });
                        }

                        if (vote.star) {

                            queue.push(function(done) {
                                Star.create({
                                    repo: repo.uuid,
                                    comm: comm.sha,
                                    user: 'tool',
                                    name: tool.name
                                }, function(err, star) {
                                    done();
                                });
                            });

                        }

                        async.parallel(queue, function() {
                            res.send(201);
                        });
                    });
                });
            });
        }
    });
});

module.exports = router;
