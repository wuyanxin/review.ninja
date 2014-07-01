var MailChimpAPI = require('mailchimp').MailChimpAPI;

module.exports = {

	call: function(call, done) {
		var obj = call.obj;
		var fun = call.fun;
		var arg = call.arg;

		var mailchimp = new MailChimpAPI(config.mailchimp.key, {
			version: '2.0'
		});

		mailchimp.call(obj, fun, arg, function(err, res) {
			done(err, res);
		});
	}
};