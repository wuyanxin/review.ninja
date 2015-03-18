'use strict';
var github = require('../services/github');

module.exports = {
  createRepo: function(token, username, done) {
    github.call({
      obj: 'repos',
      fun: 'create',
      arg: {
        name: "review-ninja-welcome",
        description: "test",
      },
      token: token
    }, function(err, res) {
      if (err) {
        console.log("error: ", err);
      }
      else {
        console.log('created repo, creating separate branch now...');
        done();
      }
    });
  },

  createFile = function(token, username, branch, cb) {
    github.call({
      obj: 'repos',
      fun: 'createFile',
      arg: {
        user: username,
        repo: 'review-ninja-welcome',
        path: 'hello.txt',
        message: 'first',
        content: (branch === 'master' ? new Buffer('hello ninja').toString('base64') : new Buffer('hello ' + username).toString('base64')), 
        branch: branch
      },
      token: token
    }, function(err, res) {
      if (err) {
        console.log("error: ", err);
      }
      else {
        if (branch === 'master') {
          console.log('done with creating master file, creating quick-edit branch...');
          // console.log(token);
          createBranch(token, username, cb, res.commit.tree.sha);
        }
        else {
          console.log(res);
          console.log('done with making quick-edit file change, making pull request...');
          done();
        }
      }
    });
  },

  createBranch: function(token, username, sha, done) {
    github.call({
      obj: 'gitdata',
      fun: 'createReference',
      arg: {
        user: username,
        repo: 'review-ninja-welcome',
        ref: 'refs/heads/quickedit',
        sha: sha
      },
      token: token
    }, function(err, res) {
      if (err) {
        console.log("error: ", err);
        console.log(token);
        console.log(sha);
      }
      else {
        console.log('done creating branch, making file change now...')
        done();
      }
    });
  },

  createPullRequest: function(token, username, done) {
    github.call({
      obj: 'pullRequests',
      fun: 'create',
      arg: {
        user: username,
        repo: 'review-ninja-welcome',
        title: 'hallo',
        base: 'master',
        head: 'quick-edit'
      },
      token: token
    }, function(err, res) {
      if (err) {
        console.log("error: ", err);
      }
      else {
        console.log('done making pull request, redirecting now...');
        done();
      }
    });
  },
}
