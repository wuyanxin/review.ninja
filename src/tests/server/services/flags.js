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
      {body: 'flagged with !fix and !fixed', commit_id: 'test', path: 'file', position: 1},
      {body: 'flagged with !fixed', commit_id: 'test', path: 'file', position: 1},
      {body: 'flagged with !resolve', commit_id: 'test', path: 'file', position: 1},
      {body: 'flagged with !completed', commit_id: 'test', path: 'file', position: 1},
      {body: 'flagged with !fix', commit_id: 'test', path: 'file', position: 2},
      {body: 'flagged with !fix and !fixed', commit_id: 'test', path: 'file', position: 2},
      {body: 'not flagged', commit_id: 'test', path: 'file', position: 3},
      {body: 'flagged with !fix', commit_id: 'test', path: 'file', position: 2},
      {body: 'flagged with !fixed', commit_id: 'test', path: 'file', position: 2}
    ];

    var result = flags.review(comments);
    assert.deepEqual(result, {open: 2, closed: 1});
    done();
  });
});

describe('flags:conversation', function() {
  it('should return true if a conversation has a ninja star flag', function(done) {
    var fakeFalseComment = {body: 'this has no flag'};
    var fakeTrueComment = {body: 'this has a !star'};
    var falseResult = flags.conversation(fakeFalseComment);
    var trueResult = flags.conversation(fakeTrueComment);
    assert.equal(falseResult, false);
    assert.equal(trueResult, true);
    done();
  });
});
