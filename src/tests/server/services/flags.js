'use strict';
// unit test
var rewire = require('rewire');
var assert = require('assert');
var sinon = require('sinon');

// services
var flags = require('../../../server/services/flags');

// config
global.config = require('../../../config');

describe('flags:review', function() {
  it('should get the proper number of opened and closed issues', function(done) {
    var comments = [
      {body: 'flagged with !fix and !fixed', original_commit_id: 'test', path: 'file', original_position: 1},
      {body: 'flagged with !fixed', original_commit_id: 'test', path: 'file', original_position: 1},
      {body: 'flagged with !resolve', original_commit_id: 'test', path: 'file', original_position: 1},
      {body: 'flagged with !completed', original_commit_id: 'test', path: 'file', original_position: 1},
      {body: 'flagged with !fix', original_commit_id: 'test', path: 'file', original_position: 2},
      {body: 'flagged with !fix and !fixed', original_commit_id: 'test', path: 'file', original_position: 2},
      {body: 'not flagged', original_commit_id: 'test', path: 'file', original_position: 3}
    ];

    var result = flags.review(comments);
    assert.deepEqual(result, {open: 1, closed: 1});
    done();
  });
});

describe('flags:conversation', function() {
  it('should return true if a conversation has a ninja star flag', function(done) {
    var fakeFalseComment = 'this has no flag';
    var fakeTrueComment = 'this has a !star';
    var falseResult = flags.conversation(fakeFalseComment);
    var trueResult = flags.conversation(fakeTrueComment);
    assert.equal(falseResult, false);
    assert.equal(trueResult, true);
    done();
  });
});
