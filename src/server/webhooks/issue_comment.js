// models
var Repo = require('mongoose').model('Repo');
var User = require('mongoose').model('User');

//services
var github = require('../services/github');
var notification = require('../services/notification');
var status = require('../services/status');
var pullRequest = require('../services/pullRequest');

//////////////////////////////////////////////////////////////////////////////////////////////
// Github Issue comment Webhook Handler
//////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(req, res) {

    Repo.with({
        uuid: req.args.repository.id
    }, function(err, repo) {

        if (err) {
            return;
        }

        if (repo.ninja) {

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
        }
    });

    res.end();
};
