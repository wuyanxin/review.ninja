require('trace.ninja');
// unit test
var assert = require('assert');
// models
var Comm = require('../../../server/documents/comm').Comm;
var Vote = require('../../../server/documents/vote').Vote;
// approval
var Strategy = require('../../../server/approval/default');

describe('approval::default', function () {

	var ninja;

	beforeEach(function() {
		ninja = new Strategy({
			strategy: 'default',
			approval: {
				approved: +2,
				rejected: -2
			}
		});
	});

	it('should yield pending', function (done) {

		ninja.approval([ ], function(err, approval) {
			
			assert.equal(approval, 'pending');

			done();
		});

	});

	it('should yield pending', function (done) {

		ninja.approval([{
			vote: 'Not a number'
		}], function(err, approval) {
			
			assert.equal(approval, 'pending');

			done();
		});

	});

	it('should yield pending', function (done) {

		ninja.approval([{
			vote: +1
		}], function(err, approval) {
			
			assert.equal(approval, 'pending');

			done();
		});

	});

	it('should yield pending', function (done) {

		ninja.approval([{
			vote: -1
		}], function(err, approval) {
			
			assert.equal(approval, 'pending');

			done();
		});

	});


	it('should yield approved', function (done) {

		ninja.approval([{
			vote: +1
		}, {
			vote: +1
		}], function(err, approval) {
			
			assert.equal(approval, 'approved');

			done();
		});

	});

	it('should yield rejected', function (done) {

		ninja.approval([{
			vote: -1
		}, {
			vote: -1
		}], function(err, approval) {
			
			assert.equal(approval, 'rejected');

			done();
		});

	});

	it('should yield error', function (done) {

		var ninja = new Strategy({
			strategy: 'default',
			approval: {
				approved: 'Not a Number',
				rejected: 'Not a Number'
			}
		});

		ninja.approval([ ], function(err, approval) {
			
			assert.equal(err, 'Configuration invalid');

			done();
		});

	});

});