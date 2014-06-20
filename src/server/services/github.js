
var GitHubApi = require('github');

module.exports = {

	call: function(call, done) {

		var obj = call.obj;
		var fun = call.fun;
		var arg = call.arg;
		var token = call.token;

		var github = new GitHubApi({version: '3.0.0'});

		// augument the client

		['hasFirstPage', 
		 'hasLastPage', 
		 'hasNextPage', 
		 'hasPreviousPage'].forEach(function(f) {

			github.page = github.page || {};

			github.page[f] = function(args, done) {
				try {
					done(null, !!github[f](args.link));
				} catch(ex) {
					done(ex.toString());
				}
			};

		});

		// augument the client

		['getFirstPage', 
		 'getLastPage', 
		 'getNextPage', 
		 'getPreviousPage'].forEach(function(f) {

			github.page = github.page || {};

			github.page[f] = function(args, done) {

				try {
					github[f](args.link, done);
				} catch(ex) {
					done(ex.toString());
				}
			};

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

		github[obj][fun](arg, function(err, res) {

			var meta;

			try {
				meta = res.meta; delete res.meta;
			}
			catch(ex) {
				meta = null;
			}

			done(err, res, meta);
		
		});

	}

};