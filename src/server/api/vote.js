// module
var approval = require('../services/approval');
// models
var Comm = require("../documents/comm.js").Comm;
var Vote = require("../documents/vote.js").Vote;

module.exports = {

/************************************************************************************************************

	Models:

	+ Vote, where repo=repo-uuid, comm=comm-uuid, user=user-uuid

************************************************************************************************************/

	all: function(req, done) {

		Vote.find({repo: req.args.repo, comm: req.args.comm}, function(err, vote) {
			
			done(err, vote);

		});

	},


/************************************************************************************************************

	Models:

	+ Vote, where repo=repo-uuid, comm=comm-uuid, user=user-uuid

************************************************************************************************************/

	get: function(req, done) {

		Vote.findOne({repo: req.args.repo, comm: req.args.comm, user: req.user.id}, function(err, vote) {
			
			done(err, vote);

		});

	},

/************************************************************************************************************

	Models:

	+ Vote

************************************************************************************************************/

	set: function(req, done) {

		Vote.create({repo: req.args.repo, comm: req.args.comm, user: req.user.id, vote: req.args.vote}, function(err, vote) {

			done(err, vote);

		});

	},

/************************************************************************************************************

	Models:

	+ Comm, where repo=repo-uuid, uuid=repo-uuid

************************************************************************************************************/

	status: function(req, done) {

		Comm.with({repo: req.args.repo, uuid: req.args.comm}, function(err, comm) {

			var status = comm ? comm.status : "pending";
			
			done(err, status);
		
		});

	},

/************************************************************************************************************

	Models:

	+ Comm

************************************************************************************************************/

	calculate: function(req, done) {

		approval(req.args.comm, function(err, approval) {

			done(null, approval);

		});

	}

};