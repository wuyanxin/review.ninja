'use strict';

var github = require('../services/github');
var status = require('../services/status');

module.exports = function(req, res) {
    var user = req.args.repository.owner.login;
    var repo = req.args.repository.name;
    var sender = req.args.sender;
    var repo_uuid = req.args.repository.id;
    var sha = req.args.pull_request.head.sha;

    var actions = {
        created: function() {
            status.update({
                sha: sha,
                user: user,
                repo: repo,
                repo_uuid: repo_uuid
            });
            var event = user + ':' + repo + ':' + 'pull-request-review-comment-' + req.args.comment.id;
            io.emit(event, req.args.comment.id);
        }
    };

    if (actions[req.args.action]) {
        actions[req.args.action]();
    }

    res.end();
};
