// models
var Star = require('mongoose').model('Star');
var User = require('mongoose').model('User');

//services
var github = require('../services/github');
var status = require('../services/status');
var star = require('../services/star');
var notification = require('../services/notification');

//////////////////////////////////////////////////////////////////////////////////////////////
// Github Issue comment Webhook Handler
//////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(req, res) {

    var actions = {
        created: function() {
            User.findOne({ _id: req.params.id }, function(err, user) {
                if(err || !user) {
                    return res.status(404).send('User not found');
                }
                if(req.args.comment.body.match(/(\+1)|(:\+1:)/)) {
                    github.call({
                        obj: 'pullRequests',
                        fun: 'get',
                        arg: {
                            user: req.args.repository.owner.login,
                            repo: req.args.repository.name,
                            number: req.args.issue.number
                        },
                        token: user.token
                    }, function(err, pull) {
                        if(!err) {
                            console.log('5');
                           star.create(pull.head.sha, req.args.repository.owner.login, req.args.repository.name, req.args.repository.id, req.args.issue.number, req.args.sender, user.token);
                        }
                    });
                }

                var event = req.args.repository.owner.login + ':' +
                            req.args.repository.name + ':' +
                            'issue-comment-' + req.args.issue.id;
                io.emit(event, req.args.comment.id);
            });
        }
    };

    if (actions[req.args.action]) {
        actions[req.args.action]();
    }

    res.end();
};
