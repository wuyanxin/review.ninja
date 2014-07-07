// models
var User = require('../documents/user.js').User;

User.aggregate({$project: {token: 0}});

module.exports = {

/************************************************************************************************************

	Models:

	+ User, where user=user-uuid

************************************************************************************************************/

	get: function(req, done) {

		User.findOne({uuid: req.args.user}, function(err, user) {
			
			done(err, user);

		});

	}

};