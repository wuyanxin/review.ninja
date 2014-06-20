require('trace.ninja');
// unit test
var assert = require('assert');
// models
var Comm = require("../../../server/documents/comm").Comm;
var Vote = require("../../../server/documents/vote").Vote;
// approval
var approval = require('../../../server/approval/default');

describe('approval::default', function () {

	it('should yield pending', function (done) {

		approval({
			approval: {
				approved: +2,
				rejected: -2
			}
		}, [ ], function(err, approval) {
			
			assert.equal(approval, "pending");

			done();
		});

	});

	it('should yield pending', function (done) {

		approval({
			approval: {
				approved: +2,
				rejected: -2
			}
		}, [{
			vote: "Not a number"
		}], function(err, approval) {
			
			assert.equal(approval, "pending");

			done();
		});

	});

	it('should yield pending', function (done) {

		approval({
			approval: {
				approved: +2,
				rejected: -2
			}
		}, [{
			vote: +1
		}], function(err, approval) {
			
			assert.equal(approval, "pending");

			done();
		});

	});

	it('should yield pending', function (done) {

		approval({
			approval: {
				approved: +2,
				rejected: -2
			}
		}, [{
			vote: -1
		}], function(err, approval) {
			
			assert.equal(approval, "pending");

			done();
		});

	});


	it('should yield approved', function (done) {

		approval({
			approval: {
				approved: +2,
				rejected: -2
			}
		}, [{
			vote: +1
		}, {
			vote: +1
		}], function(err, approval) {
			
			assert.equal(approval, "approved");

			done();
		});

	});

	it('should yield rejected', function (done) {

		approval({
			approval: {
				approved: +2,
				rejected: -2
			}
		}, [{
			vote: -1
		}, {
			vote: -1
		}], function(err, approval) {
			
			assert.equal(approval, "rejected");

			done();
		});

	});

	it('should yield error', function (done) {

		approval({
			approval: {
				approved: "Not a Number",
				rejected: "Not a Number"
			}
		}, [ ], function(err, approval) {
			
			assert.equal(err, "Configuration invalid");

			done();
		});

	});

});