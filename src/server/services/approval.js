var assert = require('assert');
// module
// var default = require('../approval/default');
// var webhook = require('../approval/webhook');


module.exports = function(uuid, done) {

	// models
	var Comm = require('mongoose').model('Comm');
	var Vote = require('mongoose').model('Vote');

	Comm.with({uuid: uuid}, function(err, comm) {

		if(!comm) {
			return done(null, 'pending');
		}

		// check that comm.config.strategy maps to a file

		var Strategy = require('../approval/' + (comm.config.strategy || 'default'));

		Vote.find({comm: uuid}, function(err, votes) {

			if(!votes) {
				return done(null, 'pending');
			}

			if(err) {
				return done(err, null);
			}

			var ninja = new Strategy(comm.config);

			ninja.approval(votes, function(err, approval) {

				if(err) {
					return done(null, 'pending');
				}

				done(err, approval);

			});

		});

	});

};