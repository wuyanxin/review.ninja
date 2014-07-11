require('trace.ninja');
// unit test
var assert = require('assert');
// approval
var Strategy = require('../../../server/approval/default');

describe('approval::default', function () {

	var ninja;

	var sha = '1234567';

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

		ninja.approval([ ], sha, function(err, approval) {
			
			assert.equal(approval, 'pending');

			done();
		});

	});

	it('should yield pending', function(done) {

		ninja.approval([{
			vote: {}
		}], sha, function(err, approval) {

			assert.equal(approval, 'pending');

			done();
		});
	});

	it('should yield pending', function (done) {

		ninja.approval([{
			vote: {
				value: 'Not a number'
			}
		}], sha, function(err, approval) {
			
			assert.equal(approval, 'pending');

			done();
		});

	});

	it('should yield pending', function (done) {

		ninja.approval([{
			vote: {
				value: 1
			}
		}], sha, function(err, approval) {
			
			assert.equal(approval, 'pending');

			done();
		});

	});

	it('should yield pending', function (done) {

		ninja.approval([{
			vote: {
				value: -1
			}
		}], sha, function(err, approval) {
			
			assert.equal(approval, 'pending');

			done();
		});

	});


	it('should yield approved', function (done) {

		ninja.approval([{
			vote: {
				value: 1
			}
		}, {
			vote: {
				value: 1
			}
		}], sha, function(err, approval) {
			
			assert.equal(approval, 'approved');

			done();
		});

	});

	it('should yield rejected', function (done) {

		ninja.approval([{
			vote: {
				value: -1
			}
		}, {
			vote: {
				value: -1
			}
		}], sha, function(err, approval) {
			
			assert.equal(approval, 'rejected');

			done();
		});

	});

	it('should yield an error', function(done) {

		ninja.approval(null, sha, function(err, approval) {

			assert.equal(err, 'Votes must be an array');

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

		ninja.approval([ ], sha, function(err, approval) {
			
			assert.equal(err, 'Configuration invalid');

			done();
		});

	});

});