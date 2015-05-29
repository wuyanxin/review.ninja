'use strict';
// unit test
var assert = require('assert');
var sinon = require('sinon');

// TODO: write ALL the tests

// config
global.config = require('../../../config');

// documents
var Action = require('../../../server/documents/action').Action;

// services
var onboard = require('../../../server/services/onboard');

// api
var onboardApi = require('../../../server/api/onboard');

// describe('onboard:getactions', function() {
//     it('should get object with actions mapped to if user has performed them', function(done) {
//       var actionStub = sinon.stub(Action, 'find', function(args) {
//         assert.equal(args.uuid, 'uuid');
//         assert.equal(args.user, 'user');
//         assert.equal(args.repo, 'repo');
//         return {
//           distinct: function(query, done) {
//             assert.equal(query, 'type');
//             var actions = {'test': false, 'test1': false};
//             done(null, actions);
//           }
//         }
//       });

//       var req = {
//         user: {
//           id: 'uuid'
//         },
//         args: {
//           user: 'user',
//           repo: 'repo'
//         }
//       };

//       var doneStub = function(err, res) {
//         assert.equal(res, {'test': true, 'test1': true});
//       };
//       onboardApi.getactions(req, doneStub);
//       actionStub.release();
//       done();
//     });
// });

describe('onboard:createrepo', function() {
    it('should create a repo and respond with the repo', function(done) {
      var createRepoStub = sinon.stub(onboard, 'createRepo', function(token, login, done) {
        assert.equal(token, 'token');
        assert.equal(login, 'user');
        var repo = {};
        done(null, repo);
      });

      var createFileStub = sinon.stub(onboard, 'createFile', function(token, login, done) {
        assert.equal(token, 'token');
        assert.equal(login, 'user');
        var file = {};
        done(null, file);
      });

      var getBranchStub = sinon.stub(onboard, 'getBranch', function(login, done) {
        assert.equal(login, 'user');
        var branch = {object: {sha: 'aaaa'}};
        done(null, branch);
      });

      var createBranchStub = sinon.stub(onboard, 'createBranch', function(token, login, branchSha, done) {
        assert.equal(token, 'token');
        assert.equal(login, 'user');
        assert.equal(branchSha, 'aaaa');
        var branch = {};
        done(null, branch);
      });

      var getFileStub = sinon.stub(onboard, 'getFile', function(login, done) {
        assert.equal(login, 'user');
        var file = {sha: 'bbbb'};
        done(null, file);
      });

      var updateFileStub = sinon.stub(onboard, 'updateFile', function(token, login, sha, done) {
        assert.equal(token, 'token');
        assert.equal(login, 'user');
        assert.equal(sha, 'bbbb');
        var file = {};
        done(null, file);
      });

      var createPullRequestStub = sinon.stub(onboard, 'createPullRequest', function(token, login, done) {
        assert.equal(token, 'token');
        assert.equal(login, 'user');
        var pull = {};
        done(null, pull);
      });

      var getRepoStub = sinon.stub(onboard, 'getRepo', function(token, login, done) {
        assert.equal(token, 'token');
        assert.equal(login, 'user');
        done();
      });

      var stubArray = [createRepoStub, createFileStub, getBranchStub, getFileStub, updateFileStub, createPullRequestStub, getRepoStub];
      var doneStub = function() {
        return;
      };
      var req = {
        user: {
          login: 'user',
          token: 'token'
        }
      };
      onboardApi.createrepo(req, doneStub);
      stubArray.forEach(function(stub) {
        stub.restore();
      });
      done();
    });
});
