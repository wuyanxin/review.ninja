// unit test
var assert = require('assert');
var sinon = require('sinon');

// documents
var Star = require('../../../server/documents/star').Star;

// services
var star = require('../../../server/services/star');

describe('star:remove', function() {
  it('should remove star', function() {
    var starStub = sinon.stub(Star, 'findOne', function(args, done) {
      assert.deepEqual(args, {sha: 'sha', repo: 'repo'});
      done();
    });

    var req = {
      args: {
        sha: 'sha',
        repo_uuid: 'repo'
      }
    };

    var sha = 'sha',
        user = 'user',
        repo = 1,
        repo_uuid = 1234,
        number = 2,
        sender = 'gabe',
        token = 'ffffff';

    star.remove(sha, user, repo, repo_uuid, number, sender, token, function(error, res) {
      sinon.assert.called(starStub);
      starStub.restore();
      done();
    });
  });
}); 