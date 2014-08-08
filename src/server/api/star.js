// models
var Repo = require('mongoose').model('Repo');
var Comm = require('mongoose').model('Comm');
var Star = require('mongoose').model('Star');
var GitHubStatusApiService = require('../services/github-status-api');

module.exports = {

    /************************************************************************************************************

    @models

    + Star, where repo=repo-uuid, comm=comm-uuid

    ************************************************************************************************************/

    all: function(req, done) {

        Star.find({repo: req.args.repo, comm: req.args.comm}, function(err, star) {

            done(err, star);

        });

    },


    /************************************************************************************************************

    @models

    + Star, where repo=repo-uuid, comm=comm-uuid, user=user-uuid

    ************************************************************************************************************/

    get: function(req, done) {

        Star.with({
            repo: req.args.repo,
            comm: req.args.comm,
            user: req.user.id
        }, function(err, star) {

            done(err, star);

        });

    },

    /************************************************************************************************************

    @models

    + Star

    ************************************************************************************************************/

    set: function(req, done) {

        Repo.with({uuid: req.args.repo_uuid}, function(err, repo) {

            if(err){
                return done(err,repo);
            }

            Star.create({repo: req.args.repo_uuid, comm: req.args.sha, user: req.user.id, name: req.user.login}, function(err, star) {
                io.emit(req.args.user + ':' + req.args.repo + ':pull-request-'+req.args.number+':starred', {});
                GitHubStatusApiService.updatePullRequestStatus(req.args.user, req.args.repo, req.args.repo_uuid, req.args.sha, req.args.number, req.user.token);
                done(err, star);
            });

        });

    },

    /************************************************************************************************************

    @models

    + Star

    ************************************************************************************************************/

    rmv: function(req, done) {
        Star.with({
            repo: req.args.repo_uuid,
            comm: req.args.sha,
            user: req.user.id
        }, function(err, star) {
            if(star) {
                star.remove(function(err, star) {
                    io.emit(req.args.user + ':' + req.args.repo + ':pull-request-'+req.args.number+':unstarred', {});
                    GitHubStatusApiService.updatePullRequestStatus(req.args.user, req.args.repo, req.args.repo_uuid, req.args.sha, req.args.number, req.user.token);
                    done(err, star);
                });
            }
        });
    }
};
