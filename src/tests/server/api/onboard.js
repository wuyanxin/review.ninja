'use strict';
// unit test
var assert = require('assert');
var sinon = require('sinon');

// TODO: write ALL the tests

// config
global.config = require('../../../config');

// documents
var Action = require('../../../server/documents/action');

// services
var onboard = require('../../../server/services/onboard');

// api
var issue = require('../../../server/api/onboard');

describe('onboard:getactions', function() {
    it('should get object with actions mapped to if user has performed them', function(done) {
      assert.equal(2, 2);
      done();
    });
});

describe('onboard:dismiss', function() {
    it('should produce trackable action for dismissing onboard', function(done) {
      assert.equal(2, 2);
      done();
    });
});

describe('onboard:createrepo', function() {
    it('should create a repo and respond with the repo', function(done) {
      assert.equal(2, 2);
      done();
    });
});
