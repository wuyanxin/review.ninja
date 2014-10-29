// unit test
var assert = require('assert');
var sinon = require('sinon');

// config
global.config = require('../../../config');

// documents
var Milestone = require('../../../server/documents/milestone').Milestone;

// service
var github = require('../../../server/services/github');
var milestone = require('../../../server/services/milestone');

describe('milestone:get', function(done) {
    it('should return milestone if found', function(done) {
        var milestoneStub = sinon.stub(Milestone, 'findOne', function(args, done) {
            assert.equal(args.repo, 1);
            assert.equal(args.pull, 2);
            done(null, {
                repo: 1,
                pull: 2,
                number: 3
            });
        });

        milestone.get('user', 'repo', 1, 2, 'token', function(err, milestone) {
            assert.deepEqual(milestone, {
                repo: 1,
                pull: 2,
                number: 3
            });

            milestoneStub.restore();
            done();
        });
    });

    it('should create milestone if not found', function(done) {
        var milestoneFindOneStub = sinon.stub(Milestone, 'findOne', function(args, done) {
            assert.equal(args.repo, 1);
            assert.equal(args.pull, 2);
            done(null, null);
        });

        var githubStub = sinon.stub(github, 'call', function(args, done) {
            assert.equal(args.obj, 'issues');
            assert.equal(args.fun, 'createMilestone');
            assert.equal(args.token, 'token');
            assert.deepEqual(args.arg, {
                user: 'user',
                repo: 'repo',
                title: 'Pull Request #2'
            });

            done(null, {
                number: 3
            });
        });

        var milestoneCreateStub = sinon.stub(Milestone, 'create', function(args, done) {
            assert.deepEqual(args, {
                repo: 1,
                pull: 2,
                number: 3
            });

            done(null, args);
        });

        milestone.get('user', 'repo', 1, 2, 'token', function(err, milestone) {
            assert.deepEqual(milestone, {
                repo: 1,
                pull: 2,
                number: 3
            });

            milestoneFindOneStub.restore();
            githubStub.restore();
            milestoneCreateStub.restore();

            done();
        });
    });
});

describe('milestone:close', function(done) {
    it('should silently exit if no milestone found', function(done) {
        var milestoneStub = sinon.stub(Milestone, 'findOne', function(args, done) {
            assert.equal(args.repo, 1);
            assert.equal(args.pull, 2);
            done(null, null);
        });

        milestone.close('user', 'repo', 1, 2, 'token');

        milestoneStub.restore();
        done();
    });

    it('should close milestone if milestone found', function(done) {
        var milestoneStub = sinon.stub(Milestone, 'findOne', function(args, done) {
            assert.equal(args.repo, 1);
            assert.equal(args.pull, 2);
            done(null, {
                repo: 1,
                pull: 2,
                number: 3
            });
        });

        var githubStub = sinon.stub(github, 'call', function(args) {
            assert.equal(args.obj, 'issues');
            assert.equal(args.fun, 'updateMilestone');
            assert.equal(args.token, 'token');
            assert.deepEqual(args.arg, {
                user: 'user',
                repo: 'repo',
                number: 3,
                state: 'closed'
            });
        });

        milestone.close('user', 'repo', 1, 2, 'token');

        milestoneStub.restore();
        githubStub.restore();
        done();
    });
});
