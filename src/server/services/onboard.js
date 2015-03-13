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
  getUser: function(res) {
    return res.upserted[0]._id;
  },

  addUserAsCollaborator: function(user, token) {
    console.log(user);
    github.call({
      headers: {
        'Content-Length': 0
      },
      obj: 'repos',
      fun: 'addCollaborator',
      arg: {
        user: 'gruiz17', //todo - change to reviewninja or reviewninja affiliated username
        repo: 'read-this-first', //todo - change to repo
        collabuser: user
      }
    }, function(err, res) {
      if (err) {
        console.log("error: ", err);
      }
      else {
        console.log('res: ', res);
      }
    });
  },

  createPR: function(user) {

  },

  addRepoToProfile: function(user) {

  }
}