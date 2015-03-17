'use strict';
var github = require('../services/github');
var crypto = require('crypto');

//////auxillary functions
var sha;

var getSha = function(token, username, cb) {
  github.call({
    obj: 'gitdata',
    fun: 'getReference',
    arg: {
      user: username,
      repo: 'review-ninja-welcome',
      ref: 'refs/heads/master'
    },
    token: token
  }, function(err, res) {
    if (err) {
      console.log("error: ", err)
    }
    else {
      console.log(res);
      return res.object.sha;
    }
  });
}

var createBranch = function(token, username, cb) {
  github.call({
    obj: 'gitdata',
    fun: 'createReference',
    arg: {
      user: username,
      repo: 'review-ninja-welcome',
      ref: 'refs/heads/quick-edit',
      sha: getSha(token, username)
    },
    token: token
  }, function(err, res) {
    if (err) {
      console.log("error: ", err);
    }
    else {
      console.log('done creating branch, making file change now...')
      createFile(token, username, cb, 'quick-edit')
    }
  });
}

var createFile = function(token, username, cb, branch) {
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
        // createBranch(token, username, cb);
        getSha(token, username, cb);
      }
      else {
        console.log('done with making quick-edit file change, making pull request...');
        createPullRequest(token, username, cb);
      }
    }
  });
}

var createPullRequest = function(token, username, cb) {
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
      cb();
    }
  });
}

///////

module.exports = {
  createRepo: function(token, username, cb) {
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
        createFile(token, username, cb, 'master');
      }
    });
  }
}
