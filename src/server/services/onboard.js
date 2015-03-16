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
///////

module.exports = {

  createRepo: function(token, cb) {
    github.call({
      obj: 'repos',
      fun: 'create',
      arg: {
        name: "test" + Math.random().toString(),
        description: "test",
      },
      token: token
    }, function(err, res) {
      if (err) {
        console.log("error: ", err);
      }
      else {
        cb();
      }
    });
  },

  createPR: function(user) {

  },

  addRepoToProfile: function(user) {

  }
}