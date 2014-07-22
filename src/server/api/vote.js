// module
var approval = require('../services/approval');
// models
var Repo = require('mongoose').model('Repo');
var Comm = require('mongoose').model('Comm');
var Vote = require('mongoose').model('Vote');

module.exports = {

/************************************************************************************************************

	@models

	+ Vote, where repo=repo-uuid, comm=comm-uuid

************************************************************************************************************/

	all: function(req, done) {

		Vote.find({repo: req.args.repo, comm: req.args.comm}, function(err, vote) {
			
			done(err, vote);

		});

	},


/************************************************************************************************************

	@models

	+ Vote, where repo=repo-uuid, comm=comm-uuid, user=user-uuid

************************************************************************************************************/

	get: function(req, done) {

		Vote.with({repo: req.args.repo, comm: req.args.comm, user: req.user.id}, function(err, vote) {
			
			done(err, vote);

		});

	},

/************************************************************************************************************

	@models

	+ Vote

************************************************************************************************************/

	set: function(req, done) {

		Repo.with({uuid: req.args.repo}, function(err, repo) {

			// To Do:
			// - verify that the vote is valid
			// - verify comm status is still pending

			Vote.create({repo: req.args.repo, comm: req.args.comm, user: req.user.id, name:req.user.login, vote: req.args.vote}, function(err, vote) {

				if(!err) {
					require('../bus').emit('vote:add', {
						uuid: repo.uuid,
						user: repo.user,
						repo: repo.name,
						comm: req.args.comm,
						login: req.user.login,
						token: req.user.token
					});
				}

				done(err, vote);

			});

		});

	},

/************************************************************************************************************

	@models

	+ Comm, where repo=repo-uuid, uuid=repo-uuid

************************************************************************************************************/

	status: function(req, done) {

		Comm.with({repo: req.args.repo, uuid: req.args.comm}, function(err, comm) {

			var status = comm ? comm.status : 'pending';
			
			done(err, status);
		
		});

	},

/************************************************************************************************************

	@models

	+ Comm

************************************************************************************************************/

	calculate: function(req, done) {

		approval(req.args.comm, function(err, approval) {

			done(null, approval);

		});

	}

};