// models
var User = require('mongoose').model('User');

//services
var github = require('../services/github');
var status = require('../services/status');
var pullRequest = require('../services/pullRequest');
var notification = require('../services/notification');

//////////////////////////////////////////////////////////////////////////////////////////////
// Github Issue comment Webhook Handler
//////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(req, res) {

    var actions = {
        created: function() {
            if(pullRequest.byLabels(req.args.issue.labels)) {
                var event = req.args.repository.owner.login + ':' +
                            req.args.repository.name + ':' +
                            'issue-comment-' + req.args.issue.id;
                io.emit(event, req.args.comment.id);
            }
        }
    };

    if (actions[req.args.action]) {
        actions[req.args.action]();
    }

    res.end();
};
