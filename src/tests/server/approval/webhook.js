require('trace.ninja');
// unit test
var assert = require('assert');
var sinon = require('sinon');
// approval
var Strategy = require('../../../server/approval/webhook');
// utils
var request = require('request');

describe('approval::webhook', function() {

	var ninja;

	beforeEach(function() {
		ninja = new Strategy({
			strategy: 'webhook',
			approval: 'http://review.ninja/hook/approval'
		});
	});

	it('should yeild pending', function(done) {

		var stubRequest = sinon.stub(request, 'post', function(opts, done) {

			done(null, {statusCode: 200}, 'pending');
		});

		ninja.approval([ ], function(err, approval) {

			assert.equal(approval, 'pending');

			stubRequest.restore();

			done();
		});
	});

	it('should yeild pending', function(done) {

		var stubRequest = sinon.stub(request, 'post', function(opts, done) {

			done(null, {statusCode: 200}, null);
		});

		ninja.approval([ ], function(err, approval) {

			assert.equal(approval, 'pending');

			stubRequest.restore();

			done();
		});
	});

	it('should yeild pending', function(done) {

		var stubRequest = sinon.stub(request, 'post', function(opts, done) {

			done(null, {statusCode: 404}, 'approved');
		});

		ninja.approval([ ], function(err, approval) {

			assert.equal(approval, 'pending');

			stubRequest.restore();

			done();
		});
	});

	it('should yeild pending', function(done) {

		var stubRequest = sinon.stub(request, 'post', function(opts, done) {

			done(true, {statusCode: 500}, null);
		});

		ninja.approval([ ], function(err, approval) {

			assert.equal(approval, 'pending');

			stubRequest.restore();

			done();
		});
	});

	it('should yeild pending', function(done) {

		var stubRequest = sinon.stub(request, 'post', function(opts, done) {

			done(null, {statusCode: 200}, 'this is not allowed');
		});

		ninja.approval([ ], function(err, approval) {

			assert.equal(approval, 'pending');

			stubRequest.restore();

			done();
		});
	});

	it('should yeild approved', function(done) {

		var stubRequest = sinon.stub(request, 'post', function(opts, done) {

			done(null, {statusCode: 200}, 'approved');
		});

		ninja.approval([ ], function(err, approval) {

			assert.equal(approval, 'approved');

			stubRequest.restore();

			done();
		});
	});

	it('should yeild rejected', function(done) {

		var stubRequest = sinon.stub(request, 'post', function(opts, done) {

			done(null, {statusCode: 200}, 'rejected');
		});

		ninja.approval([ ], function(err, approval) {

			assert.equal(approval, 'rejected');

			stubRequest.restore();

			done();
		});
	});

	it('should yeild error', function(done) {

		var ninja = new Strategy({
			strategy: 'webhook',
			approval: 'not-a-url'
		});

		ninja.approval([ ], function(err, approval) {

			assert.equal(err, 'Configuration is not valid url');

			done();
		});
	});
	
});