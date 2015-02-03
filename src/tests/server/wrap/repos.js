// unit test
var assert = require('assert');
var sinon = require('sinon');

// config
global.config = require('../../../config');

// io
global.io = {emit: function() {}};

// models
var User = require('../../../server/documents/user').User;

// services
var githubService = require('../../../server/services/github');

// api
var github = require('../../../server/api/github');

describe('repos:getCollaborators', function() {
    it('should fetch all collaborators unknown to ReviewNinja', function(done) {
        var collaboratorRegistered = {
            id: 1
        };
        var collaboratorUnknown = {
            id: 2
        };

        var githubServiceStub = sinon.stub(githubService, 'call', function(args, done) {
            assert.equal(args.user, 'user');
            assert.equal(args.repo, 'repo');
            assert.equal(args.token, 'token');
            done(null, {
                collaborators: [collaboratorRegistered, collaboratorUnknown]
            }, null);
        });

        var userStub = sinon.stub(User, 'findOne', function(args, done) {
            if(args.uuid === collaboratorRegistered.id) {
                return done(null, collaboratorRegistered);
            }
            return done(null, null);
        });

        var req = {
            args: {
                obj: 'repos',
                fun: 'getCollaborators',
                user: 'user',
                repo: 'repo'
            },
            user: {
                token: 'token'
            }
        };

        github.wrap(req, function(err, res) {
            assert.equal(null, err);

            assert.equal(1, res.data.collaborators[0].id);
            assert.equal(true, res.data.collaborators[0].reviewNinjaUser);

            assert.equal(2, res.data.collaborators[1].id);
            assert.equal(false, res.data.collaborators[1].reviewNinjaUser);

            githubServiceStub.restore();
            userStub.restore();

            done();
        });
    });
});
