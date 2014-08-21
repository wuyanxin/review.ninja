// models
var Repo = require('mongoose').model('Repo');
var User = require('mongoose').model('User');

//services
var github = require('../services/github');
var notification = require('../services/notification');
var status = require('../services/status');

//////////////////////////////////////////////////////////////////////////////////////////////
// Github Issue comment Webhook Handler
//////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(req, res) {

    function has_pull_request_label(labels) {

        for(var i=0; i<labels.length; i++){

            var reg = /pull-request-(\d*)?/;
            var match = reg.exec(labels[i].name); 

            if (match) {
                return true;
            }
        }

        return false;
    }

    Repo.with({
        uuid: req.args.repository.id
    }, function(err, repo) {

        if (err) {
            return;
        }

        if (repo.ninja) {

            var actions = {
                created: function() {
                    if(has_pull_request_label(req.args.issue.labels)) {

                        var event = req.args.repository.owner.login + ':' + 
                                    req.args.repository.name + ':' +
                                    'issue-comment-' + req.args.issue.id;

                        io.emit(event, req.args.comment.id);
                    }
                }
            };

            if (!actions[req.args.action]) {
                return;
            }

            actions[req.args.action]();
        }
    });

    res.end();
};
