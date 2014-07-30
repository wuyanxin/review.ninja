// module
var parse = require('parse-diff');
var github = require('../services/github');

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

            files.forEach(function(file) {
                file.lines = parse(file.patch);
            });

            done(err, files);
        });

    }

};