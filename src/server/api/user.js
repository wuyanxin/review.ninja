var User = require('mongoose').model('User');

module.exports = {

    get: function(req, done) {

        User.with({ uuid: req.user.id }, function(err, user) {
            if(err) {
                return done(err, null);
            }

            done(err, {repos: user ? user.repos : null});
        });

    }
};