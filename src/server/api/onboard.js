var Action = require('mongoose').model('Action');
module.exports = {
  getactions: function(req, done) {
    Action.find({uuid: req.user.id}, function(err, res) {
      var types = ['user:addRepo', 'pullRequests:get', 'issues:add', 'issues:closed', 'star:add', 'pullRequests:merge'];
      var bools = [false, false, false, false, false, false];
      var filtered = res.filter(function(x) { return (typeof x.type !== undefined && types.indexOf(x.type) > -1)});
      res.forEach(function(x) {
        if (typeof x.type !== undefined && types.indexOf(x.type) > -1) {
          bools[types.indexOf(x.type)] = true;
        }
      });
      console.log({types: bools});
      done(err, {types: bools});
    });
  }
};
