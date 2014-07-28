// models
var User = require('mongoose').model('User');

User.aggregate({
    $project: {
        token: 0
    }
});

module.exports = {

    /************************************************************************************************************

	@models

	+ User, where user=user-uuid

************************************************************************************************************/

    get: function(req, done) {

        User.findOne({
            uuid: req.args.user
        }, function(err, user) {

            done(err, {
                name: user ? user.name : null
            });

        });

    }

};
