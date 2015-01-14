// services
var github = require('../services/github');

module.exports = {
    get: function(req, done) {
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
            if(err) {
                return done(err);
            }
            var ignores = [];
            try {
                var ninja = new Buffer(file.content, 'base64').toString('ascii');
                ignores = ninja.split('\n');
                for (var i = 0; i < ignores.length; i++) {
                    if(ignores[i] === '') {
                        ignores.splice(i, 1);
                    }
                }
            } catch(ex) {
                console.log('ex', ex);
                return done(ex);
            }
            done(err, { ignored: ignores });
        });
    }
};
