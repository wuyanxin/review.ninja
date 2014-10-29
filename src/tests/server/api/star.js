// unit test
var assert = require('assert');
var sinon = require('sinon');

// config
global.config = require('../../../config');

// models
var User = require('../../../server/documents/user').User;
var Star = require('../../../server/documents/star').Star;
var Settings = require('../../../server/documents/settings').Settings;

// services
var url = require('../../../server/services/url');
var github = require('../../../server/services/github');
var notification = require('../../../server/services/notification');
var status = require('../../../server/services/status');

// api
var star = require('../../../server/api/star');

describe('star:all', function(done) {
    it('should set the correct parameters when calling find', function(done) {
        var starStub = sinon.stub(Star, 'find', function(args, done) {
            assert.deepEqual(args, {sha: 'sha', repo: 'repo'});
            done();
        });

        var req = {
            args: {
                sha: 'sha',
                repo_uuid: 'repo'
            }
        };

        star.all(req, function(error, res) {
            starStub.restore();
            done();
        });

    });
});

describe('star:get', function() {
    it('should set the correct parameters when calling get', function(done) {
        var starStub = sinon.stub(Star,'findOne', function(args, done) {
            assert.deepEqual(args, {sha: 'sha', repo: 'repo', user: 1234});
            done();
        });

        var req = {
            args: {
                repo_uuid: 'repo',
                sha: 'sha'
            },
            user: {
                id: 1234
            }
        };

        star.get(req, function(err, res) {
            starStub.restore();
            done();
        });
    });
});

describe('star:set', function() {

    it('should return an error if github call repos one errors', function(done) {
        var githubStub = sinon.stub(github, 'call', function(args, done) {
            done('github repos one error');
        });

        var req = {
            args: {
                repo_uuid: 1
            },
            user: {
                token: 'token'
            }
        };

        star.set(req, function(err, star) {
            assert.equal(err, 'github repos one error');

            githubStub.restore();
            done();
        });
    });

    it('should return an error if github call repos one returns permission to pull does not exists', function(done) {
        var githubStub = sinon.stub(github, 'call', function(args, done) {
            done(null, {permissions: {}});
        });

        var req = {
            args: {
                repo_uuid: 1
            },
            user: {
                token: 'token'
            }
        };

        star.set(req, function(err, star) {
            assert.deepEqual(err, {
                code: 403,
                text: 'Forbidden'
            });

            githubStub.restore();
            done();
        });
    });

    it('should create a star and update statuses/notifications accordingly', function(done) {

        global.io = {emit: sinon.spy()};

        var githubStub = sinon.stub(github, 'call', function(args, done) {
            assert.deepEqual(args, {
                obj: 'repos',
                fun: 'one',
                arg: {id: 1},
                token: 'token'
            });

            done(null, {permissions: {pull: true}});
        });

        var starStub = sinon.stub(Star, 'create', function(args, done) {
            assert.deepEqual(args, {
                sha: 'sha',
                repo: 1,
                user: 3,
                name: 'login',
                created_at: '4'
            });

            done(null, {});
        });

        var notificationStub = sinon.stub(notification, 'sendmail', function(notification_type, user, repo, repo_uuid, repo_token, pull_request_number, args) {
            assert.equal(notification_type, 'star');
            assert.equal(user, 'user');
            assert.equal(repo, 'repo');
            assert.equal(repo_uuid, 1);
            assert.equal(repo_token, 'token');
            assert.equal(pull_request_number, 2);
            assert.deepEqual(args, {
                user: 'user',
                repo: 'repo',
                number: 2,
                sender: {id:3, login:'login', token:'token'},
                url: url.reviewPullRequest('user', 'repo', 2)
            });
        });

        var dateStub = sinon.stub(Date, 'now', function() {
            return 4;
        });

        var statusStub = sinon.stub(status, 'update', function(args) {
            assert.deepEqual(args, {
                user: 'user',
                repo: 'repo',
                sha: 'sha',
                repo_uuid: 1,
                number: 2,
                token: 'token'
            });
        });

        var req = {
            args: {
                sha: 'sha',
                repo: 'repo',
                user: 'user',
                name: 'name',
                repo_uuid: 1,
                number: 2
            },
            user: {
                id: 3,
                login: 'login',
                token: 'token'
            }
        };

        star.set(req, function(err, res) {
            assert(io.emit.called);
            assert(io.emit.calledWith('user:repo:pull-request-2:starred', {}));

            githubStub.restore();
            starStub.restore();
            notificationStub.restore();
            dateStub.restore();
            statusStub.restore();
            done();
        });
    });

});

describe('star:rmv', function() {

    it('should return an error if it occurs when retrieving the star', function(done) {
        var starStub = sinon.stub(Star, 'findOne', function(args, done) {
            done('mongoose star error');
        });

        var req = {
            args: {
                repo_uuid: 1,
                sha: 'sha'
            },
            user: {id: 2}
        };

        star.rmv(req, function(err, res) {
            assert.equal(err, 'mongoose star error');

            starStub.restore();
            done();
        });
    });

    it('should create no notifications/statuses when removing a star return no star', function(done) {

        global.io = {emit: sinon.spy()};

        var starStub = sinon.stub(Star, 'findOne', function(args, done) {
            var star = {
                remove: function(done) {
                    done(null, {});
                }
            };
            done(null, star);
        });

        var statusStub = sinon.stub(status, 'update', function(args) {
            assert.deepEqual(args, {
                user: 'user',
                repo: 'repo',
                repo_uuid: 1,
                sha: 'sha',
                number: 2,
                token: 'token'
            });
        });

        var notificationStub = sinon.stub(notification, 'sendmail', function(notification_type, user, repo, repo_uuid, repo_token, pull_request_number, args) {
            assert.equal(notification_type, 'unstar');
            assert.equal(user, 'user');
            assert.equal(repo, 'repo');
            assert.equal(repo_uuid, 1);
            assert.equal(repo_token, 'token');
            assert.equal(pull_request_number, 2);
            assert.deepEqual(args, {
                user: 'user',
                repo: 'repo',
                number: 2,
                sender: {id:3, login:'login', token:'token'},
                url: url.reviewPullRequest('user', 'repo', 2)
            });
        });

        var req = {
            args: {
                user: 'user',
                repo: 'repo',
                repo_uuid: 1,
                sha: 'sha',
                number: 2
            },
            user: {
                id: 3,
                login: 'login',
                token: 'token'
            }
        };

        star.rmv(req, function(err, res) {
            assert(io.emit.called);
            assert(io.emit.calledWith('user:repo:pull-request-2:unstarred', {}));

            starStub.restore();
            statusStub.restore();
            done();
        });
    });

});
