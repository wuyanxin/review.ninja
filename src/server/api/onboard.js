'use strict';
var Action = require('mongoose').model('Action');
var onboard = require('../services/onboard');

module.exports = {
  getactions: function(req, done) {
    Action.find({uuid: req.user.id}).distinct('type', function(err, actions) {
      if (err) {
        return done(err);
      }
      console.log(actions);
      var res = {};
      actions.forEach(function(a) {
        res[a] = true;
      });
      console.log(res);
      done(null, res);
//      return res;
    });
  },

  dismiss: function(req, done) {
      console.log('dismissed');
      done();
  },

  createrepo: function(req, done) {
    onboard.createRepo(req.user.token, req.user.login, function() {
        onboard.createFile(req.user.token, req.user.login, 'master', function() {
            onboard.getBranchSha(req.user.login, function(sha) {
                onboard.createBranch(req.user.token, req.user.login, sha, function() {
                    onboard.getFileSha(req.user.login, function(sha) {
                        onboard.updateFile(req.user.token, req.user.login, sha, 'quickedit', function() {
                            onboard.createPullRequest(req.user.token, req.user.login, function() {
                                onboard.getRepo(req.user.token, req.user.login, function(res) {
                                    done(null, res);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
  },

  test: function(req, done) {
    console.log(req.user);
    console.log(req.user.token);
  }
};
