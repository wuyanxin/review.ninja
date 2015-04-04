'use strict';
var Action = require('mongoose').model('Action');
var onboard = require('../services/onboard');

module.exports = {
  getactions: function(req, done) {
    Action.find({uuid: req.user.id, user: req.args.user, repo: req.args.repo}).distinct('type', function(err, actions) {
      if (err) {
        return done(err);
      }

      var res = {};
      actions.forEach(function(a) {
        res[a] = true;
      });

      done(null, res);
    });
  },

  createrepo: function(req, done) {
    onboard.createRepo(req.user.token, req.user.login, function(err, repo) {

        if(err) {
            return done(err);
        }

        onboard.createFile(req.user.token, req.user.login, function(err, file) {

            if(err) {
                return done(err);
            }

            onboard.getBranch(req.user.login, function(err, branch) {

                if(err) {
                    return done(err);
                }

                onboard.createBranch(req.user.token, req.user.login, branch.object.sha, function(err, branch) {

                    if(err) {
                        return done(err);
                    }

                    onboard.getFile(req.user.login, function(err, file) {

                        if(err) {
                            return done(err);
                        }

                        onboard.updateFile(req.user.token, req.user.login, file.sha, function(err, file) {

                            if(err) {
                                return done(err);
                            }

                            onboard.createPullRequest(req.user.token, req.user.login, function(err, pull) {

                                if(err) {
                                    return done(err);
                                }

                                onboard.getRepo(req.user.token, req.user.login, done);
                            });
                        });
                    });
                });
            });
        });
    });
  }
};
