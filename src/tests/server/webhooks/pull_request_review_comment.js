'use strict';
// unit test
var assert = require('assert');
var sinon = require('sinon');

// services
var status = require('../../../server/services/status');

// io
global.io = {emit: function() {}};

// webhooks
var pull_request_review_comment = require('../../../server/webhooks/pull_request_review_comment');

describe('pull_request_review_comment', function() {
  it('should send message to frontend and update status', function(done) {
    var req = {
      args: require('../../fixtures/webhooks/pull_request_review_comment/created.json')
    };

    // stubs
    var statusStub = sinon.stub(status, 'update', function(args) {
      assert.deepEqual(args, {
        user: 'reviewninja',
        repo: 'foo',
        sha: '5e985f53a5f03e821622c75f8249fe7fff85edf8',
        repo_uuid: 35846545
      });
    });

    var ioStub = sinon.stub(io, 'emit', function(event, id) {
      assert.equal('reviewninja:foo:pull-request-review-comment-33873474', event);
      assert.equal('33873474', id);
    });

    pull_request_review_comment(req, {
      end: function() {
        statusStub.restore();
        ioStub.restore();
      }
    });
    done();
  });
});

