
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

	}
};