// models
var Repo = require('mongoose').model('Repo');
var Comm = require('mongoose').model('Comm');
var Star = require('mongoose').model('Star');

var status = require('../services/status');
var notification = require('../services/notification');

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
                return done(err, repo);
            }

            Star.create({repo: req.args.repo_uuid, comm: req.args.sha, user: req.user.id, name: req.user.login}, function(err, star) {

                if(!err) {

                    io.emit(req.args.user + ':' + req.args.repo + ':pull-request-' + req.args.number + ':starred', {});

                    status.update({ 
                        user: req.args.user, 
                        repo: req.args.repo, 
                        repo_uuid: req.args.repo_uuid, 
                        sha: req.args.sha, 
                        number: req.args.number, 
                        token: req.user.token
                    }, function(err, res) {

                    });
                    
                    notification.star(req.args.user, req.user.login, req.args.number, repo, req.args.repo);
                }
                
                done(err, star);
            });

        });

    },

    /************************************************************************************************************

    @models

    + Star

    ************************************************************************************************************/

    rmv: function(req, done) {
        Repo.with({uuid: req.args.repo_uuid}, function(err,repo){
            Star.with({
                repo: req.args.repo_uuid,
                comm: req.args.sha,
                user: req.user.id
            }, function(err, star) {

                if(err){
                    return done(err, repo);
                }

                star.remove(function(err, star) {

                    if(!err) {

                        io.emit(req.args.user + ':' + req.args.repo + ':pull-request-' + req.args.number + ':unstarred', {});

                        status.update({
                            user: req.args.user, 
                            repo: req.args.repo, 
                            repo_uuid: req.args.repo_uuid, 
                            sha: req.args.sha, 
                            number: req.args.number, 
                            token: req.user.token
                        }, function(err, res) {
                            
                        });
                        
                        notification.unstar(req.args.user, req.user.login, req.args.number, repo, req.args.repo);
                    }
                    
                    done(err, star);
                });
            });
        });

    }
};
