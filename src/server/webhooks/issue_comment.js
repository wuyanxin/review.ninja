var logger = require('../log');
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
    console.log('COMMENTING');

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
            return logger.log(err);
        }

        if (repo.ninja) {

            // to be reviewed by review.ninja so let's go on

            var action = req.body.action;
            var issue = req.body.issue;
            var comment = req.body.comment;
            var labels = issue.labels;

            var actions = {

                created: function() {
                    // check the label
                    if(has_pull_request_label(labels)) {
                        io.emit('new issue_comment for ' + issue.id, comment.id);
                    }
                }
            };

            if (!actions[action]) {
                return logger.log('unsupported action for issues');
            }

            actions[action]();
        }
    });

    res.end();
};
