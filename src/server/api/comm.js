
var github = require("../services/github");

module.exports = {

	ninja: function(req, done) {

		var user = req.args.user;
		var repo = req.args.repo;
		var comm = req.args.comm;

		github({obj: "repos", fun: "getContent", arg: {user: user, repo: repo, ref: comm, path: ".ninja.json"}, token: req.user.token}, function(err, obj) {
			
			var content;

			try {
				content = new Buffer(obj.content, 'base64').toString();
			} catch(ex) {
				content = null;
			}

			var config;

			try {
				config = JSON.parse(content);
			} catch(ex) {
				config = null;
			}

			return done(null, {
				content: content,
				config: config
			});

		});
	},

	file: function(req, done) {

		var user = req.args.user;
		var repo = req.args.repo;
		var sha = req.args.sha;

		github({
			obj: 'gitdata',
			fun: 'getBlob',
			arg: {
				user: user,
				repo: repo,
				sha: sha
			},
			token: req.user.token
		}, function(err, obj) {

			var json;

			try {
				switch(obj.encoding) {
					case 'base64':
						json = (new Buffer(obj.content, 'base64')).toString();
						break;
					default:
						json = '';
						break;
				}
			} catch(ex) {
				json = '';
			}

			done(null, {
				content: json
			});

		});

	}
};