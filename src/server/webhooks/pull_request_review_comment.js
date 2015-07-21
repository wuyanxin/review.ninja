'use strict';

// models
var User = require('mongoose').model('User');
var Action = require('mongoose').model('Action');

// services
var github = require('../services/github');
var status = require('../services/status');

module.exports = function(req, res) {
    var user = req.args.repository.owner.login;
    var repo = req.args.repository.name;
    var sender = req.args.sender;
    var repo_uuid = req.args.repository.id;
    var sha = req.args.pull_request.head.sha;
    var number = req.args.pull_request.number;

    // for the thread
    var comment_sha = req.args.comment.original_commit_id;
    var path = req.args.comment.path;
    var position = req.args.comment.original_position;

    User.findOne({ _id: req.params.id }, function(err, ninja) {

        if(err || !ninja) {
            return res.status(404).send('User not found');
        }

        var actions = {
            created: function() {
                status.update({
                    sha: sha,
                    user: user,
                    repo: repo,
                    number: number,
                    repo_uuid: repo_uuid,
                    token: ninja.token
                });
                github.call({
                    obj: 'pullRequests',
                    fun: 'getComments',
                    arg: {
                        user: user,
                        repo: repo,
                        number: number
                    },
                    token: ninja.token
                }, function(err, comments) {
                    if (!err && comments) {
                        if (comments.filter(function(comment) {
                            return (comment_sha === comment.original_commit_id) && (path === comment.path) && (position === comment.original_position);
                        }).length === 1) {
                            Action.create({
                                uuid: req.args.sender.id,
                                user: user,
                                repo: repo,
                                type: 'pullRequests:createReviewThread'
                            });
                        }
                    }
                });
            }
        };

        if (actions[req.args.action]) {
            actions[req.args.action]();
        }

        res.end();
    });
};
