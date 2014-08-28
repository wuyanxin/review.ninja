require('trace.ninja');

// unit test
var assert = require('assert');
var sinon = require('sinon');

// config
global.config = require('../../../config');

// service
var github = require('../../../server/services/github');

describe('github:call', function(done) {
    it('should return an error if obj is not set', function(done) {
        github.call({}, function(err) {
            assert.equal(err, 'obj required/obj not found');
            done();
        });
    });

    it('should return an error if fun is not set', function(done) {
        github.call({obj: 'obj'}, function(err) {
            assert.equal(err, 'obj required/obj not found');
            done();
        });
    });

    it('should authenticate when token is set', function(done) {
        // TODO
        done();
    });

    it('should call the appropriate function on the github api', function(done) {
        // TODO
        done();
    });
});
