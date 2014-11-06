// unit test
var assert = require('assert');
var sinon = require('sinon');

// config
global.config = require('../../../config');

// io
global.io = {emit: function() {}};

// documents
var Star = require('../../../server/documents/star').Star;
// webhooks
var issue_comment = require('../../../server/webhooks/issue_comment');

// services
var url = require('../../../server/services/url');
var github = require('../../../server/services/github');

describe('issue_comment', function(done) {
    it('should add a ninja star on thumbsup or plus-one', function(done) {
        var req = {
            params: {id: 123456},
            args: require('../../fixtures/webhooks/issue_comment/created_thumbsup.json')
        };

        var userStub = sinon.stub(User, 'findOne', function(args, done) {
            console.log('args\n', args);
            assert.equal(args._id, 123456);
            done(null, null);
        });

        pull_request(req, {
            end: function() {
                userStub.restore();
                done();
            }
        });
        done();
    });
});
