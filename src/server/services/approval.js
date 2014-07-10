var fs = require('fs');
var assert = require('assert');
var path = require('path');
var sugar = require('array-sugar');


module.exports = function(uuid, done) {

	// models
	var Comm = require('mongoose').model('Comm');
	var Vote = require('mongoose').model('Vote');

	Comm.with({uuid: uuid}, function(err, comm) {

		if(!comm) {
			return done(null, 'pending');
		}


		// ensure against hacks - clean this up
		// var strategies = fs.readdirSync(path.resolve(process.cwd(), 'src/server/approval/'));

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