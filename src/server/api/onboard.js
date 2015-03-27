'use strict';
var Action = require('mongoose').model('Action');
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
  }
};
