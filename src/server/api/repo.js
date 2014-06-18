
var github = require('../services/github');

var Repo = require('../documents/repo.js').Repo;

module.exports = {

/************************************************************************************************************

	Models:

	+ Repo, where repo=repo-uuid

************************************************************************************************************/

	get: function(req, done) {

		github.call({obj: 'repos', fun: 'getCollaborator', arg: {user: req.args.user, repo: req.args.repo, collabuser: req.user.login}, token: req.user.token}, function(err, repo) {

			// missing
			// authorisation

			Repo.findOne({uuid: req.args.uuid}, function(err, repo) {

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

		github.call({obj: 'repos', fun: 'get', arg: {user: req.args.user, repo: req.args.repo}, token: req.user.token}, function(err, repo) {

			if(!repo) {
				return done({code: 404, text: 'Not found'});
			}

			if(repo.owner.login !== req.user.login) {
				return done({code: 403, text: 'Forbidden'});
			}

			Repo.findOneAndUpdate({uuid: req.args.uuid}, {uuid: req.args.uuid, name: req.args.repo, token: req.user.token, ninja: true}, {upsert: true}, function(err, vote) {
				done(err, vote);
			});

		});

	},

/************************************************************************************************************

	Models:

	+ Vote, where repo=repo-uuid

************************************************************************************************************/

	rmv: function(req, done) {

		github.call({obj: 'repos', fun: 'get', arg: {user: req.args.user, repo: req.args.repo}, token: req.user.token}, function(err, repo) {

			if(!repo) {
				return done({code: 404, text: 'Not found'});
			}

			if(repo.owner.login !== req.user.login) {
				return done({code: 403, text: 'Forbidden'});
			}

			Repo.findOneAndUpdate({uuid: req.args.uuid}, {uuid: req.args.uuid, name: req.args.repo, token: req.user.token, ninja: false}, {upsert: true}, function(err, vote) {
				done(err, vote);
			});

		});

	}

};