
var github = require('../services/github');

var Repo = require('../documents/repo.js').Repo;

module.exports = {

/************************************************************************************************************

	Models:

	+ Repo, where repo=repo-uuid

************************************************************************************************************/

	get: function(req, done) {

		github.call({obj: 'repos', fun: 'one', arg: {id: req.args.uuid}, token: req.user.token}, function(err, repo) {

			console.log(repo);

			if(!repo) {
				return done({code: 404, text: 'Not found'});
			}

			if(!repo.permissions.pull) {
				return done({code: 403, text: 'Forbidden'});
			}

			Repo.with({uuid: req.args.uuid}, function(err, repo) {

				if(!repo) {
					return done({code: 404, text: 'Not found'});
				}

				done(err, repo);

			});

		});

	},

/************************************************************************************************************

	Models:

	+ Repo, where repo=repo-uuid

************************************************************************************************************/

	add: function(req, done) {

		github.call({obj: 'repos', fun: 'one', arg: {id: req.args.uuid}, token: req.user.token}, function(err, repo) {

			if(!repo) {
				return done({code: 404, text: 'Not found'});
			}

			if(!repo.permissions.admin) {
				return done({code: 403, text: 'Forbidden'});
			}

			Repo.with({uuid: req.args.uuid}, {token: req.user.token, ninja: true}, function(err, repo) {
				done(err, repo);
			});

		});

	},

/************************************************************************************************************

	Models:

	+ Repo, where repo=repo-uuid

************************************************************************************************************/

	rmv: function(req, done) {

		github.call({obj: 'repos', fun: 'one', arg: {id: req.args.uuid}, token: req.user.token}, function(err, repo) {

			if(!repo) {
				return done({code: 404, text: 'Not found'});
			}

			if(!repo.permissions.admin) {
				return done({code: 403, text: 'Forbidden'});
			}

			Repo.with({uuid: req.args.uuid}, {token: req.user.token, ninja: false}, function(err, repo) {
				done(err, repo);
			});

		});

	}

};