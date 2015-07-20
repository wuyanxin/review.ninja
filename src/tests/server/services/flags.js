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
    var fakeStarComment = 'this has a !star';
    var fakeUnstarComment = 'this is !unstar';
    var fakeUnstarComment2 = 'this is -1';
    var bothFlagsComment = '!star and !unstar';
    var falseResult = flags.conversation(fakeFalseComment);
    var trueResult = flags.conversation(fakeStarComment);
    var removeResult1 = flags.conversation(fakeUnstarComment);
    var removeResult2 = flags.conversation(fakeUnstarComment2);
    var removeResult3 = flags.conversation(bothFlagsComment);
    assert.equal(falseResult, undefined);
    assert.equal(trueResult, 'create');
    assert.equal(removeResult1, 'remove');
    assert.equal(removeResult2, 'remove');
    assert.equal(removeResult3, 'remove');
    done();
  });
});
