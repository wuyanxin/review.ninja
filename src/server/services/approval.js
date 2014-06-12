
var approval = require('../approval/default');

var Comm = require('mongoose').model('Comm');
var Vote = require('mongoose').model('Vote');

module.exports = function(comm, done) {

	Comm.findOne({uuid: comm}, function(err, comm) {

		var config = JSON.parse(comm.ninja);

		Vote.find({comm: comm}, function(err, vote) {

			approval(config, vote, function(err, approval) {

				Comm.update({uuid: comm.uuid}, {approval: approval}, function(err, count) {



				});

			});

		});

	});

};