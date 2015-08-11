'use strict';

// services
var pullRequest = require('../services/pullRequest');

module.exports = {

    get: function(req, done) {
        pullRequest.status({
            sha: req.args.sha,
            user: req.args.user,
            repo: req.args.repo,
            number: req.args.number,
            repo_uuid: req.args.repo_uuid,
            token: req.user.token
        }, done);
    }

};
