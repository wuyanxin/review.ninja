var logger = require('../log');
// models
var Repo = require('mongoose').model('Repo');
var User = require('mongoose').model('User');

//services
var github = require('../services/github');
var notification = require('../services/notification');

//////////////////////////////////////////////////////////////////////////////////////////////
// Github Pull Request Webhook Handler
//////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(req, res) {

  var uuid = req.body.repository.id;

  function get_collaborators(user, repo, token, done) {
    args = {user: user, repo: repo};
    github.call({obj: 'repos', fun: 'getCollaborators', arg: args, token: token}, function(err, collaborators) {
      var collaborator_ids = collaborators.map(function(collaborator) {
        return collaborator.id;
      }); 
      User.find().where('uuid').in(collaborator_ids).exec(function(err, collaborators) {
        done(err, collaborators);
      }); 
    });
  }

  Repo.with({uuid: uuid}, function(err, repo) {
    if(err) {
      logger.log(err);
    }
    if(repo.ninja) {
      // to be reviewed by review.ninja so let's go on

      var action = req.body.action;
      var pull_request_number = req.body.number;
      var repository = req.body.repository;
      var user = repository.owner.login;
      var repo_name = repository.name;
      var slug = repository.full_name;
      var pull_request = req.body.pull_request;
      var sender = req.body.sender;
      var review_url = 'http://' + config.server.http.host + ':' + config.server.http.port + '/' + repository.full_name + '/pull/' +req.body.number;
      var latest_commit_sha = req.body.pull_request.head.sha;

      get_collaborators(user, repo_name, repo.token, function(err, collaborators) {
        if(err) {
          logger.log(err);
        }

        args = {
          user: user, 
          repo: repo_name, 
          sha: latest_commit_sha, 
          state: 'pending', 
          description: 'To be reviewed.', 
          target_url: review_url
        };
        var actions = {
          opened: function() {
            github.call({obj: 'statuses', fun: 'create', arg: args, token: repo.token}, function(err, data) {
              if(err) {
                logger.log(err);
                return;
              }
              notification.pull_request_opened(slug, pull_request_number, sender, collaborators, review_url);
            });
          },
          synchronize: function() {
            github.call({obj: 'statuses', fun: 'create', arg: args, token: repo.token}, function(err, data) {
              if(err) {
                logger.log(err);
                return;
              }
              notification.pull_request_synchronized(slug, pull_request_number, sender, collaborators, review_url);
            });
          },
          closed: function() {
            // a pull request you have been reviewing has closed
            // nothing to do
          },
          reopened: function() {
            // a pull request you have reviewed has a been reopened
            // send messages to responsible users?
          }
        };
        if(actions[action]) {
          actions[action]();
          return;
        }
        logger.log('unsupported action for pull requests');
      });
    }
    res.end();
  });
};
