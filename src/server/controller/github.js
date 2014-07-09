var express = require('express');
var logger = require('../log');
// models
var Repo = require('mongoose').model('Repo');
var User = require('mongoose').model('User');

//services
var github = require('../services/github');
var notification = require('../services/notification');

//////////////////////////////////////////////////////////////////////////////////////////////
// Github controller
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.all('/github/webhook', function(req, res, next) {

  var event = req.headers['x-github-event'];

  if(event == 'pull_request') {
    var uuid = req.body.repository.id;

    Repo.with({uuid: uuid}, function(err, repo) {
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

        var set_latest_commit_to_pending = function () {
          var latest_commit_sha = req.body.pull_request.head.sha;
          github.call({obj: 'statuses', fun: 'create', arg: {user: user, repo: repo_name, sha: latest_commit_sha, state: 'pending', description: 'To be reviewed.', target_url: review_url}, token: repo.token}, function(err, data) {
            // sets latest commit status to pending, or if error occurs, log it
            if(err) {
              logger.log(err);
            }
          });
        };

        github.call({obj: 'repos', fun: 'getCollaborators', arg: {user: user, repo: repo_name}, token: repo.token}, function(err, collaborators) {
          var collaborator_ids = collaborators.map(function(collaborator) {
              return collaborator.id;
          });
          User.find().where('uuid').in(collaborator_ids).exec(function(err, collaborators) {
            if(err) {
              logger.log(err);
              return;
            }
            if(action == 'opened') {
              notification.pull_request_opened(slug, pull_request_number, sender, collaborators, review_url);
              set_latest_commit_to_pending();
            }else if(action == 'synchronize') {
              notification.pull_request_synchronized(slug, pull_request_number, sender, collaborators, review_url);
              set_latest_commit_to_pending();
            }else if(action == 'closed') {
              // a pull request you have been reviewing has closed
              // nothing to do
            }else if(action == 'reopened') {
              // a pull request you have reviewed has a been reopened
              // send messages to responsible users?
            }else{
              logger.log('unknown pull-request action');
            }
          });
        });
      }
    });
  }

  res.end();
  next();
});

module.exports = router;
