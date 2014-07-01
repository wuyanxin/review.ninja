var mailchimp = require('../services/chimp');

module.exports = {

	add: function(req, done) {

		var email = req.args.email;

		mailchimp.call({
			obj: 'lists',
			fun: 'subscribe',
			arg: {
				id: 'fefbc1ceed',
				email: {
					email: email
				}
			}
		}, function(err, res) {
			done(err, res);
		});
	}
};