var async = require('async');
var github = require('../services/github');

module.exports = {

    getComments: function(req, comments, done) {

        async.each(comments, function(comment, call) {
            github.call({
                obj: 'markdown',
                fun: 'render',
                arg: { 
                    text: comment.body,
                    mode: 'gfm',
                    context: req.args.arg.user + '/' + req.args.arg.repo
                },
                token: req.user.token
            }, function(err, render) {
                comment.html = render.data;
                return call(null);
            });

        }, function() {
            done(null, comments);
        });
    }
};
