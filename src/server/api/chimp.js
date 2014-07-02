var mailchimp = require('../services/chimp');

module.exports = {

	news: function(req, done) {

		var email = req.args.email;

		mailchimp.call({
			obj: 'lists',
			fun: 'subscribe',
			arg: {
				id: config.mailchimp.news,
				email: {
					email: email
				}
			}
		}, function(err, res) {
			done(err, res);
		});
	},

	// user: function(req, done) {

	// 	var name = req.args.name;
	// 	var email = req.args.email;
	// 	var login = req.args.login;

	// 	mailchimp.call({
	// 		obj: 'lists',
	// 		fun: 'subscribe',
	// 		arg: {
	// 			id: config.mailchimp.user,
	// 			email: {
	// 				email: email
	// 			},
	// 			merge_vars: {
	// 				name: name,
	// 				login: login
	// 			}
	// 		}
	// 	}, function(err, res) {
	// 		done(err, res);
	// 	});
	// }
};