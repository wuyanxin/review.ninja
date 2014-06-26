
var GitHubApi = require('github');

module.exports = {

	call: function(call, done) {

		var obj = call.obj;
		var fun = call.fun;
		var arg = call.arg;
		var token = call.token;

		var github = new GitHubApi({version: '3.0.0'});

		// augument the client

		github.repos.one = function(msg, callback) {

			var self = github;

			self.httpSend(msg, {
				url: '/repositories/:id', 
				params: {'$id': null},
				method: 'get' 
			}, function(err, res) {

				if (err) {
					return self.sendError(err, null, msg, callback);
				}

				var ret;
				
				try {
					ret = res.data && JSON.parse(res.data);
				}
				catch (ex) {
					if (callback)
						callback(new error.InternalServerError(ex.message), res);
					return;
				}

				if (!ret)
					ret = {};
				if (!ret.meta)
					ret.meta = {};
				['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-oauth-scopes', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
					if (res.headers[header])
						ret.meta[header] = res.headers[header];
				});

				if (callback)
					callback(null, ret);
			});
		};


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