'use strict';

var github = require('../services/github');
var status = require('../services/status');

module.exports = function(req, res) {
    var user = req.args.repository.owner.login;
    var repo = req.args.repository.name;
    // pull request review comments don't come with a 'number' 
    var sender = req.args.sender;
    var repo_uuid = req.args.repository.id;
    var sha = req.args.pull_request.head.sha;

    var event = user + ':' + repo + ':' + 'pull-request-review-comment-' + req.args.pull_request.id;
    io.emit(event, req.args.comment.id);
    status.update({
        sha: sha,
        user: user,
        repo: repo,
        repo_uuid: repo_uuid
    });
    res.end();
};
