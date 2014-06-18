
var GitHubApi = require('github');

module.exports = function(args, done) {

	var obj = args.obj;
	var fun = args.fun;
	var arg = args.arg;
	var token = args.token;

	var github = new GitHubApi({
		// required
		version: '3.0.0',
		// optional
		timeout: 5000
	});

	if(!obj || !github[obj]) {
		return done('obj required/obj not found');
	}

	if(!fun || !github[obj][fun]) {
		return done('fun required/fun not found');
	}

	if(!arg) {
		arg = {};
	}

	if(token) {
		github.authenticate({
			type: 'oauth',
			token: token
		});
	}

	var object = obj === 'client' ? github : github[obj];

	object[fun](arg, function(err, res) {

		var meta = res.meta; delete res.meta;

		done(err, res, meta);
		
	});

};