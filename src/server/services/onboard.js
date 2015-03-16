'use strict';
var github = require('../services/github');

//////auxillary functions
var createBranch = function() {

}

var addChange = function() {

}

var commitChange = function() {

}

var addIssuesToPR = function() {

}

var createFirstFile = function(token, username, cb) {
  github.call({
    obj: 'repos',
    fun: 'createFile',
    arg: {
      user: username,
      repo: 'review-ninja-welcome',
      path: 'hello.txt',
      message: 'first',
      content: new Buffer('hello ninja').toString('base64')
    },
    token: token
  }, function(err, res) {
    if (err) {
      console.log("error: ", err);
    }
    else {
      console.log('new file created!');
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
        createFirstFile(token, username, cb);
      }
    });
  },

  createPR: function(user) {

  },

  addRepoToProfile: function() {

  }
}