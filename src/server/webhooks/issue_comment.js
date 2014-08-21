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

    var uuid = req.body.repository.id;

    ///////
    //helper function
    //

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
        uuid: uuid
    }, function(err, repo) {

        if (err) {
            return;
        }

        if (repo.ninja) {

            // to be reviewed by review.ninja so let's go on

            var action = req.body.action;
            var issue = req.body.issue;
            var comment = req.body.comment;
            var labels = issue.labels;
            var repository = req.body.repository;
            var owner = repository.owner.login;

            var actions = {

                created: function() {
                    // check the label
                    if(has_pull_request_label(labels)) {
                        io.emit(owner + ':' + repository.name + ':issue-comment-' + issue.id, comment.id);
                    }
                }
            };

            if (!actions[action]) {
                return;
            }

            actions[action]();
        }
    });

    res.end();
};
