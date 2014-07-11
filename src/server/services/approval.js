var sugar = require('array-sugar');


module.exports = function(uuid, done) {

	// models
	var Comm = require('mongoose').model('Comm');
	var Vote = require('mongoose').model('Vote');

	Comm.with({uuid: uuid}, function(err, comm) {

		if( !(comm && comm.config) ) {
			return done(null, 'pending');
		}

		var strategies = [
			'default',
			'webhook'
		];

		if(!strategies.contains(comm.config.strategy)) {
			comm.config.strategy = 'default';
		}

		var Strategy = require('../approval/' + (comm.config.strategy || 'default'));

		Vote.find({comm: uuid}, function(err, votes) {

			if(!votes) {
				return done(null, 'pending');
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