var assert = require('assert');
// module
var approval = require('../approval/default');
// models
var Comm = require('mongoose').model('Comm');
var Vote = require('mongoose').model('Vote');

module.exports = function(uuid, done) {

	Comm.findOne({uuid: uuid}, function(err, comm) {

		Vote.find({comm: uuid}, function(err, vote) {

			if( !(comm && vote) ) {
				return done(null, "pending");
			}

			approval(comm.config, vote, function(err, approval) {

				if(err) {
					return done(null, "pending");
				}

				Comm.update({uuid: uuid}, {approval: approval}, function(err, count) {

					done(err, approval);

				});

			});

		});

	});

};