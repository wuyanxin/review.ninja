// module
var parse = require('parse-diff');
var github = require('../services/github');

// TO DO
// RENAME THIS MODULE TO SOMETHING MORE OBVIOUS

module.exports = {

    all: function(req, done) {

        github.call({
            obj:'pullRequests', 
            fun: 'getFiles',
            arg: {
                user: req.args.user,
                repo: req.args.repo,
                number: req.args.number
            },
            token: req.user.token
        }, function(err, files) {

            if(!err) {
                files.forEach(function(file) {
                    file.lines = parse(file.patch);
                });
            }

            done(err, files);
        });

    },

    compare: function(req, done) {

        github.call({
            obj: 'repos',
            fun: 'compareCommits',
            arg: {
                user: req.args.user,
                repo: req.args.repo,
                base: req.args.base,
                head: req.args.head
            }
        }, function(err, res) {
            
            if(!err) {
                res.files.forEach(function(file) {
                    file.lines = parse(file.patch);
                });
            }

            done(err, res);
        });
    }

};