require('./../../trace.ninja.js');
// unit test
var assert = require('assert');
var sinon = require('sinon');
// models
var Comm = require("../../../server/documents/comm").Comm;
var Vote = require("../../../server/documents/vote").Vote;
// services
var approval = require("../../../server/services/approval");

describe('approval', function () {

	it('should yield "pending" for unknown comm', function (done) {

		var stubComm = sinon.stub(Comm, "findOne", function(args, done) {
			done(null, null);
		});

		var stubVote = sinon.stub(Vote, "find", function(args, done) {
			done(null, null);
		});

		approval('123456789', function(err, approval) {

			assert.equal(approval, "pending");

			stubComm.restore();
			stubVote.restore();

			done();

		});

	});

	it('should yield "pending" for unknown vote', function (done) {

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

			assert.equal(approval, "pending");

			stubComm1.restore();
			stubComm2.restore();
			stubVote.restore();

			done();

		});

	});


});