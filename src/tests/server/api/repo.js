// unit test
var assert = require('assert');
var sinon = require('sinon');

// config
global.config = require('../../../config');

// io
global.io = {emit: function() {}};

// services
var github = require('../../../server/services/github');

// api
var repo = require('../../../server/api/repo');


describe('repo:setComment', function() {
    it('should prevent setting the repo wide comments because of insufficent permissions', function(done) {
        var githubStub = sinon.stub(github, 'call', function(args, done) {
            assert.equal(args.obj, 'repos');
            assert.equal(args.fun, 'one');
            assert.equal(args.arg.id, 'repo_uuid');
            assert.equal(args.token, 'token');
            done(null, { 
                permissions: {
                    admin: false 
                }
            });
        });

        var req = {
            args: {
                repo_uuid: 'repo_uuid'
            },
            user: {
                token: 'token'
            }
        };

        var calledOnceSpy = sinon.spy();

        var doneStub = function(err, res) {
            assert.deepEqual(err, {
                msg: 'Insufficient permissions'
            });
            calledOnceSpy();
        };

        repo.setComment(req, doneStub);

        assert(calledOnceSpy.calledOnce);

        githubStub.restore();

        done();
    });
});
