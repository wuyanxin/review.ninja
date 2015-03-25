'use strict';
var github = require('../services/github');

//todo - put err functions inside the error blocks
module.exports = {
  createRepo: function(token, username, done) {
    github.call({
      obj: 'repos',
      fun: 'create',
      arg: {
        name: "review-ninja-welcome",
        description: "test"
      },
      token: token
    }, function(err, res) {
      if (err) {
        console.log("error: ", err);
      }
      else {
        console.log('created repo, creating separate branch now...');
      }
      done(); // ONLY FOR TESTING will put in proper error/response handling functions later
    });
  },

  createFile: function(token, username, branch, done) {
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

        }
        else {
          console.log('done with making quick-edit file change, making pull request...');
        }
      }
      done(); // ONLY FOR TESTING will put in proper error/response handling functions later
    });
  },

  getBranchSha: function(username, done) {
    github.call({
      obj: 'gitdata',
      fun: 'getReference',
      arg: {
        user: username,
        repo: 'review-ninja-welcome',
        ref: 'heads/master'
      }
    }, function(err, res) {
      if (err) {
        console.log("error: ", err);
      }
      else {
        console.log("sha get! ", res.object.sha);
      }
      done(res.object.sha);
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
        console.log('done creating branch, making file change now...');
      }
      done(); // ONLY FOR TESTING will put in proper error/response handling functions later
    });
  },

  getFileSha: function(username, done) {
    github.call({
      obj: 'repos',
      fun: 'getContent',
      arg: {
        user: username,
        repo: 'review-ninja-welcome',
        ref: 'heads/quickedit',
        path: 'hello.txt'
      }
    }, function(err, res) {
      if (err) {
        console.log("error: ", err);
      }
      else {
        console.log("sha get! ", res.sha);
      }
      done(res.sha);
    });
  },

  updateFile: function(token, username, sha, branch, done) {
    github.call({
      obj: 'repos',
      fun: 'updateFile',
      arg: {
        user: username,
        repo: 'review-ninja-welcome',
        path: 'hello.txt',
        message: 'change',
        content: (branch === 'master' ? new Buffer('hello ninja').toString('base64') : new Buffer('hello ' + username).toString('base64')), 
        sha: sha,
        branch: branch
      },
      token: token
    }, function(err, res) {
      if (err) {
        console.log(sha);
        console.log("error: ", err);
      }
      else {
        console.log('done with making quick-edit file change, making pull request...');
      }
      done(); // ONLY FOR TESTING will put in proper error/response handling functions later
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
        head: 'quickedit'
      },
      token: token
    }, function(err, res) {
      if (err) {
        console.log("error: ", err);
      }
      else {
        console.log('done making pull request, redirecting now...');
      }
      done(); // ONLY FOR TESTING will put in proper error/response handling functions later
    });
  }
};
