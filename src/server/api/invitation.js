// services
var mail = require('../services/mail');
var github = require('../services/github');

module.exports = {
    invite: function(req, done) {
        github.call({
            obj: 'user',
            fun: 'getFrom',
            arg: {user: req.args.invitee},
            token: req.user.token
        }, function(err, user) {
            if(err) {
                return done({ type: 'failed' });
            }

            if(!user.email) {
                return done({ type: 'email' });
            }

            mail.send(user.email, req.user.login, req.args.user, req.args.repo, done);
        });
    },
    inviteEmail: function(req, done) {
        mail.send(req.args.email, req.user.login, req.args.user, req.args.repo, done);
    }
};
