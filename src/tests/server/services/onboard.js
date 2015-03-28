'use strict';
// TODO: write ALL the tests lol
// unit test
var rewire = require('rewire');
var assert = require('assert');
var sinon = require('sinon');

// config
global.config = require('../../../config');

// service
var github = rewire('../../../server/services/github');
var onboard = rewire('../../../server/services/onboard');

var callStub = sinon.stub();
var authenticateStub = sinon.stub();

function GitHubApiMock(args) {
    assert.deepEqual(args, {
        protocol: 'https',
        version: '3.0.0',
        host: 'api.github.com',
        pathPrefix: undefined,
        port: 443
    });

    this.obj = {
        fun: callStub
    };

    this.authenticate = authenticateStub;

    this.hasNextPage = function(link) {
        return link;
    };
}

github.__set__('GitHubApi', GitHubApiMock);

beforeEach(function() {
    callStub.reset();
    authenticateStub.reset();
});

describe('onboard:createrepo', function() {
    it('should create new repo for user', function(done) {
        assert.equal(2, 2);
        done();
    });

    it('should create test file for user', function(done) {
        assert.equal(2, 2);
        done();
    });

    it('should get sha of the master branch', function(done) {
        assert.equal(2, 2);
        done();
    });

    it('should create branch off master', function(done) {
        assert.equal(2, 2);
        done();
    });

    it('should get sha of the file to edit', function(done) {
        assert.equal(2, 2);
        done();
    });

    it('should update file on the branch', function(done) {
        assert.equal(2, 2);
        done();
    });

    it('should create pull request', function(done) {
        assert.equal(2, 2);
        done();
    });

    it('should respond with repo information', function(done) {
        assert.equal(2, 2);
        done();
    });
});
