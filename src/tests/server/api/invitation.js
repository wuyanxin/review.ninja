// unit test
var assert = require('assert');
var sinon = require('sinon');

// config
global.config = require('../../../config');

// api
var invitation = require('../../../server/api/invitation');

// services
var mail = require('../../../server/services/mail');
var github = require('../../../server/services/github');


describe('invitation:invite', function(done) {
     it('should send an invitation to the collaborator', function(done) {

        var githubStub = sinon.stub(github, 'call', function(args, done) {
            assert.equal(args.obj, 'user');
            assert.equal(args.fun, 'getFrom');
            assert.equal(args.arg.user, 'invitee');
            assert.equal(args.token, 'token');
            done(null, {email: 'email@email.com'});
        });

        var mailStub = sinon.stub(mail, 'send', function(email, login, user, repo, done) {
            assert.equal(email, 'email@email.com');
            assert.equal(login, 'login');
            assert.equal(user, 'user');
            assert.equal(repo, 'repo');
            done(null, true);
        });

        var req = {
            args: {
                user: 'user',
                repo: 'repo',
                invitee: 'invitee'
            },
            user: {
                login: 'login',
                token: 'token'
            }
        };

        invitation.invite(req, function(err, res) {

            assert(githubStub.called);
            assert(mailStub.called);

            githubStub.restore();
            mailStub.restore();

            done();
        });
    });
});
