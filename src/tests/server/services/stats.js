'use strict';
// unit test
var assert = require('assert');
var sinon = require('sinon');

// config
global.config = require('../../../config');

// models
var Action = require('../../../server/documents/action').Action;

// service
var stats = require('../../../server/services/stats');

var statsMiddleware = require('../../../server/middleware/stats');

describe('stats:queries', function() {
    it('Should have stats for each type: Add Star, Remove Star, Create Review Thread, Create Comment, Merge.', function(done) {
        var actionStub = sinon.stub(Action, 'where', function() {
            return {
                count: function(done) {
                    done(null, 3);
                }
            };
        });

        stats.statsForUserAndRepo(1234, 'casche', 'AwesomeRepo', function(stats) {
            assert.equal(stats.addStar, 3);
            assert.equal(stats.removeStar, 3);
            assert.equal(stats.createReviewThread, 3);
            assert.equal(stats.createComment, 3);
            assert.equal(stats.merge, 3);
        });

        actionStub.restore();

        done();
    });

    it('It should have middleware to capture removing a ninja star.', function(done) {
        var actionStub = sinon.stub(Action, 'create', function(obj) {
           assert.equal(obj.type, 'star:rmv');
        });

        statsMiddleware({
            originalUrl: '/api/star/rmv',
            user: {
                id: 1234
            },
            args: {
                user: 'batman',
                repo: 'batarang'
            }
        }, null, function foo() {});

        actionStub.restore();

        done();
    });

    it('It should have middleware to capture setting a ninja star.', function(done) {
        var actionStub = sinon.stub(Action, 'create', function(obj) {
            assert.equal(obj.type, 'star:add');
        });

        statsMiddleware({
            originalUrl: '/api/star/set',
            user: {
                id: 1234
            },
            args: {
                user: 'batman',
                repo: 'batarang'
            }
        }, null, function foo() {});

        actionStub.restore();

        done();
    });

    it('It should have middleware to capture adding a repo.', function(done) {
        var actionStub = sinon.stub(Action, 'create', function(obj) {
            assert.equal(obj.type, 'user:addRepo');
        });

        statsMiddleware({
            originalUrl: '/api/user/addRepo',
            user: {
                id: 1234
            },
            args: {
                user: 'batman',
                repo: 'batarang'
            }
        }, null, function foo() {});

        actionStub.restore();

        done();
    });

    it('It should have middleware to capture closing an issue.', function(done) {
        var actionStub = sinon.stub(Action, 'create', function(obj) {
            assert.equal(obj.type, 'issues:closed');
        });

        statsMiddleware({
            originalUrl: '/api/github/call',
            args: {
                obj: 'issues',
                fun: 'edit',
                arg: {
                    user: 'batman',
                    repo: 'batarang',
                    state: 'closed'
                }
            },
            user: {
                id: 1234
            }

        }, null, function foo() {});

        actionStub.restore();

        done();
    });

    it('It should have middleware to capture merging a pull request.', function(done) {
        var actionStub = sinon.stub(Action, 'create', function(obj) {
            assert.equal(obj.type, 'pullRequests:merge');
        });

        statsMiddleware({
            originalUrl: '/api/github/call',
            args: {
                obj: 'pullRequests',
                fun: 'merge',
                arg: {
                    user: 'batman',
                    repo: 'batarang'
                }
            },
            user: {
                id: 1234
            }
        }, null, function foo() {});

        actionStub.restore();

        done();
    });

    it('It should have middleware to capture creating a comment.', function(done) {
        var actionStub = sinon.stub(Action, 'create', function(obj) {
            assert.equal(obj.type, 'issues:createComment');
        });

        statsMiddleware({
            originalUrl: '/api/github/wrap',
            args: {
                obj: 'issues',
                fun: 'createComment',
                arg: {
                    user: 'batman',
                    repo: 'batarang'
                }
            },
            user: {
                id: 1234
            }
        }, null, function foo() {});

        actionStub.restore();

        done();
    });
});
