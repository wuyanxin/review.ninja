// unit test
var assert = require('assert');
var sinon = require('sinon');

// config
global.config = require('../../../config');

// services
var github = require('../../../server/services/github');

// api
var issue = require('../../../server/api/issue');

describe('issue:add', function(done){
    it('should call the github api to create an issue with a file reference', function(done){
        var githubStub = sinon.stub(github, 'call', function(args, done) {
            assert.equal(args.arg.user, 'reviewninja');
            assert.equal(args.arg.repo, 'review.ninja');
            assert.equal(args.arg.title, 'Test title');
            assert.equal(args.token, 'token');
            var body = 'Test body\r\n\r\n' +
                       '|commit|file reference|ReviewNinja|\r\n' +
                       '|------|--------------|-----------|\r\n' +
                       '|*commitsha*|[src/tests/server/api/issue.js#L24](https://github.com/reviewninja/review.ninja/blob/*commitsha*/src/tests/server/api/issue.js#L24)|[#1](https://review.ninja/reviewninja/review.ninja/pull/1)|';
            assert.equal(args.arg.body, body);
            assert.equal(args.arg.labels[0], 'review.ninja');
            assert.equal(args.arg.labels[1], 'pull-request-1');
            done(null, null);
        });

        var req = {
            args: {
                title: 'Test title',
                body: 'Test body',
                user: 'reviewninja',
                repo: 'review.ninja',
                reference: '*commitsha*/src/tests/server/api/issue.js#L24',
                sha: '*commitsha*',
                number: 1
            },
            user: {
                token: 'token'
            }
        };

        issue.add(req, function(err, res) {
            assert.equal(res, null);
            githubStub.restore();
            done();
        });
    });

    it('should call the github api to create an issue with no file reference', function(done){
        var githubStub = sinon.stub(github, 'call', function(args, done) {
            assert.equal(args.arg.user, 'reviewninja');
            assert.equal(args.arg.repo, 'review.ninja');
            assert.equal(args.arg.title, 'Test title');
            assert.equal(args.token, 'token');
            var body = 'Test body\r\n\r\n' +
                       '|commit|file reference|ReviewNinja|\r\n' +
                       '|------|--------------|-----------|\r\n' +
                       '|*commitsha*|`none`|[#1](https://review.ninja/reviewninja/review.ninja/pull/1)|';
            assert.equal(args.arg.body, body);
            assert.equal(args.arg.labels[0], 'review.ninja');
            assert.equal(args.arg.labels[1], 'pull-request-1');
            done(null, null);
        });

        var req = {
            args: {
                title: 'Test title',
                body: 'Test body',
                user: 'reviewninja',
                repo: 'review.ninja',
                sha: '*commitsha*',
                number: 1
            },
            user: {
                token: 'token'
            }
        };

        issue.add(req, function(err, res) {
            assert.equal(res, null);
            githubStub.restore();
            done();
        });
    });

    it('should return error code 400 if sha is not set', function(done){
        var req = {
            args: {
                title: 'Test title',
                body: 'Test body',
                user: 'reviewninja',
                repo: 'review.ninja',
                number: 1
            }
        };

        issue.add(req, function(err, res) {
            assert.equal(err.code, 400);
            done();
        });
    });

    it('should return error code 400 if repo is not set', function(done){
        var req = {
            args: {
                title: 'Test title',
                body: 'Test body',
                user: 'reviewninja',
                sha: '*commitsha*',
                number: 1
            }
        };

        issue.add(req, function(err, res) {
            assert.equal(err.code, 400);
            done();
        });
    });

    it('should return error code 400 if user is not set', function(done){
        var req = {
            args: {
                title: 'Test title',
                body: 'Test body',
                repo: 'review.ninja',
                sha: '*commitsha*',
                number: 1
            }
        };

        issue.add(req, function(err, res) {
            assert.equal(err.code, 400);
            done();
        });
    });

    it('should return error code 400 if title is not set', function(done){
        var req = {
            args: {
                body: 'Test body',
                user: 'reviewninja',
                repo: 'review.ninja',
                sha: '*commitsha*',
                number: 1
            }
        };

        issue.add(req, function(err, res) {
            assert.equal(err.code, 400);
            done();
        });
    });

    it('should return error code 400 if number is not set', function(done){
        var req = {
            args: {
                title: 'Test title',
                body: 'Test body',
                user: 'reviewninja',
                repo: 'review.ninja',
                sha: '*commitsha*'
            }
        };

        issue.add(req, function(err, res) {
            assert.equal(err.code, 400);
            done();
        });
    });

});
