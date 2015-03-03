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
    it('Should have stats for each type: Add Star, Remove Star, Add Issue, Remove Issue, Create Comment, Merge.', sinon.test(function(done) {
        this.stub(Action, 'where', function() {
            return {
                count: function(done) {
                    done(null, 3);
                }
            };
        });

        stats.statsForUserAndRepo(1234, 'casche', 'AwesomeRepo', function(stats) {
            assert.equal(stats.addStar, 3);
            assert.equal(stats.removeStar, 3);
            assert.equal(stats.addIssue, 3);
            assert.equal(stats.createComment, 3);
            assert.equal(stats.merge, 3);
            done();
        });
    }));

    it('It should have middleware to capture removing a ninja star.', sinon.test(function(done) {
        this.stub(Action, 'create', function(obj) {
           assert.equal(obj.type, 'star:rmv');
            done();
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
    }));

    it('It should have middleware to capture setting a ninja star.', sinon.test(function(done) {
        this.stub(Action, 'create', function(obj) {
            assert.equal(obj.type, 'star:add');
            done();
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
    }));

    it('It should have middleware to capture adding an issue.', sinon.test(function(done) {
        this.stub(Action, 'create', function(obj) {
            assert.equal(obj.type, 'issues:add');
            done();
        });

        statsMiddleware({
            originalUrl: '/api/issue/add',
            user: {
                id: 1234
            },
            args: {
                user: 'batman',
                repo: 'batarang'
            }
        }, null, function foo() {});
    }));

    it('It should have middleware to capture adding a repo.', sinon.test(function(done) {
        this.stub(Action, 'create', function(obj) {
            assert.equal(obj.type, 'user:addRepo');
            done();
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
    }));

    it('It should have middleware to capture closing an issue.', sinon.test(function(done) {
        this.stub(Action, 'create', function(obj) {
            assert.equal(obj.type, 'issues:closed');
            done();
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
    }));

    it('It should have middleware to capture merging a pull request.', sinon.test(function(done) {
        this.stub(Action, 'create', function(obj) {
            assert.equal(obj.type, 'pullRequests:merge');
            done();
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
    }));

    it('It should have middleware to capture creating a comment.', sinon.test(function(done) {
        this.stub(Action, 'create', function(obj) {
            assert.equal(obj.type, 'issues:createComment');
            done();
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
    }));
});
