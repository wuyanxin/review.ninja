'use strict';

// models
var User = require('mongoose').model('User');

// services
var github = require('../services/github');
var status = require('../services/status');

module.exports = function(req, res) {
    var user = req.args.repository.owner.login;
    var repo = req.args.repository.name;
    var sender = req.args.sender;
    var repo_uuid = req.args.repository.id;
    var sha = req.args.pull_request.head.sha;

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
                    repo_uuid: repo_uuid,
                    token: ninja.token
                });
            }
        };

        if (actions[req.args.action]) {
            actions[req.args.action]();
        }

        res.end();
    });
};
