'use strict';
// unit test
var assert = require('assert');
var sinon = require('sinon');

// config
global.config = require('../../../config');

// services
var github = require('../../../server/services/github');
var hook = require('../../../server/services/webhook');
var url = require('../../../server/services/url');

// model
var User = require('../../../server/documents/user').User;

// api
var webhook = require('../../../server/api/webhook');

describe('webhook:get', function() {
    it('should not set the webhook and return an error', function(done) {
        var githubStub = sinon.stub(github, 'call', function(args, done) {
            assert.deepEqual(args, {
                obj: 'repos',
                fun: 'getHooks',
                arg: {
                    user: 'user',
                    repo: 'repo'
                },
                token: 'token'
            });
            done('github hook error', null);
        });

        var req = {
            args: {
                user: 'user',
                repo: 'repo'
            },
            user: {
                token: 'token'
            }
        };

        webhook.get(req, function(err, hook) {
            assert.equal(err, 'github hook error');
            sinon.assert.called(githubStub);
            githubStub.restore();
            done();
        });
    });

    it('should return null if config is not in expected structure', function(done) {
        var githubStub = sinon.stub(github, 'call', function(args, done) {
            assert.deepEqual(args, {
                obj: 'repos',
                fun: 'getHooks',
                arg: {
                    user: 'user',
                    repo: 'repo'
                },
                token: 'token'
            });
            done(null, [{config: { jenkins_hook_url: 'http://ci.secret.host/github-webhook/' }}]);
        });

        var req = {
            args: {
                user: 'user',
                repo: 'repo'
            },
            user: {
                token: 'token'
            }
        };

        webhook.get(req, function(err, hook) {
            assert.equal(hook, null);
            sinon.assert.called(githubStub);
            githubStub.restore();
            done();
        });
    });

    it('should return null if config is not in expected structure', function(done) {
        var githubStub = sinon.stub(github, 'call', function(args, done) {
            assert.deepEqual(args, {
                obj: 'repos',
                fun: 'getHooks',
                arg: {
                    user: 'user',
                    repo: 'repo'
                },
                token: 'token'
            });

            done(null, [{config: { url: 'https://review.ninja/github/webhook/1234' }}]);
        });

        var req = {
            args: {
                user: 'user',
                repo: 'repo'
            },
            user: {
                token: 'token'
            }
        };

        webhook.get(req, function(err, hook) {
            assert.deepEqual(hook, {config: { url: 'https://review.ninja/github/webhook/1234' }});
            sinon.assert.called(githubStub);
            githubStub.restore();
            done();
        });
    });
});

describe('webhook:create', function() {
    it('should return null when user not found', function(done) {
        var userStub = sinon.stub(User, 'findOne', function(args, done) {
            done(null, null);
        });

        var req = {
            user: {
                uuid: 1234
            }
        };

        webhook.create(req, function(err, hook) {
            assert.equal(hook, null);
            sinon.assert.called(userStub);
            userStub.restore();
            done();
        });
    });

    it('should return the hook when found', function(done) {
        var userStub = sinon.stub(User, 'findOne', function(args, done) {
            assert.deepEqual(args, {uuid: 1234});
            done(null, {_id: 'mongooseId'});
        });

        var githubStub = sinon.stub(github, 'call', function(args, done) {
            assert.deepEqual(args, {
                obj: 'repos',
                fun: 'createHook',
                arg: {
                    user: 'user',
                    repo: 'repo',
                    name: 'web',
                    config: {url: 'https://review.ninja/github/webhook/mongooseId', content_type: 'json'},
                    events: ['pull_request', 'issues', 'issue_comment', 'status'],
                    active: true
                },
                token: 'token'
            });
            done(null, {config: {url: 'https://review.ninja/github/webhook/mongooseId'}});
        });

        var req = {
            args: {
                user: 'user',
                repo: 'repo',
                name: 'web'
            },
            user: {
                token: 'token',
                uuid: 1234
            }
        };

        webhook.create(req, function(err, hook) {
            sinon.assert.called(userStub);
            sinon.assert.called(githubStub);
            userStub.restore();
            githubStub.restore();
            done();
        });
    });
});

describe('webhook:remove', function() {
    it('should return null when hook not found', function(done) {
        var webhookStub = sinon.stub(hook, 'get', function(user, repo, token, done) {
            assert.equal(user, 'user');
            assert.equal(repo, 'repo')
            assert.equal(token, 'token')
            done(null, null);
        });

        var req = {
            args: {
                user: 'user',
                repo: 'repo'
            },
            user: {
                uuid: 1234,
                token: 'token'
            }
        };

        webhook.remove(req, function(err, hook) {
            assert.equal(hook, null);
            sinon.assert.called(webhookStub);
            webhookStub.restore();
            done();
        });
    });

    it('should remove the hook when found', function(done) {
        var webhookStub = sinon.stub(hook, 'get', function(user, repo, token, done) {
            assert.equal(user, 'user');
            assert.equal(repo, 'repo')
            assert.equal(token, 'token')
            done(null, {id: 1});
        });

        var githubStub = sinon.stub(github, 'call', function(args, done) {
            assert.deepEqual(args, {
                obj: 'repos',
                fun: 'deleteHook',
                arg: {
                    user: 'user',
                    repo: 'repo',
                    id: 1
                },
                token: 'token'
            });
            done(null, true);
        });

        var req = {
            args: {
                user: 'user',
                repo: 'repo'
            },
            user: {
                uuid: 1234,
                token: 'token'
            }
        };

        webhook.remove(req, function(err, hook) {
            sinon.assert.called(webhookStub);
            sinon.assert.called(githubStub);
            webhookStub.restore();
            githubStub.restore();
            done();
        });
    });
});
