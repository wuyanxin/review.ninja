// services
var github = require('../services/github');

module.exports = {
    ninjaignore: function(pull, file) {
        github.call({
            obj: 'repos',
            fun: 'getContent',
            arg: {
                user: req.args.user,
                repo: req.args.repo,
                ref: req.args.ref,
                path: '.ninjaignore'
            },
            token: req.user.token
        }, function(err, file) {
            var ninja;
            try {
                ninja = new Buffer(file.content, 'base64').toString('ascii');
            } catch(ex) {
                console.log('ex', ex);
            }
            done(err, ninja);
        });
    }
}
