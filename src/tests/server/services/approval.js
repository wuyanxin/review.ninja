require('./../../trace.ninja.js');
// unit test
var assert = require('assert');
var sinon = require('sinon');
// services
var approval = require("../../../server/services/approval");
// models
var Comm = require("../../../server/documents/comm").Comm;
var Vote = require("../../../server/documents/vote").Vote;

describe('approval', function () {

	it('yields not found for unknown com', function (done) {

		var stubComm = sinon.stub(Comm, "findOne", function(args, done) {
			done(null, null);
		});

		approval('123456789', function(err, approval) {

			assert.equal(err, "Not found");

			stubComm.restore();

			done();

		});

	});

	it('yields pending for unknown vote', function (done) {

		var stubComm1 = sinon.stub(Comm, "findOne", function(args, done) {
			done(null, {
				uuid: '123456789'
			});
		});

		var stubComm2 = sinon.stub(Comm, "update", function(args, opts, done) {
			done(null, {
				uuid: '123456789'
			});
		});

		var stubVote = sinon.stub(Vote, "find", function(args, done) {
			done(null, null);
		});

		approval('123456789', function(err, approval) {

			assert.equal(err, "Not found");

			stubComm1.restore();

			done();

		});

	});


});