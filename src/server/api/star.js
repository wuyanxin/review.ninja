// models
var Repo = require('mongoose').model('Repo');
var Comm = require('mongoose').model('Comm');
var Star = require('mongoose').model('Star');

module.exports = {

    /************************************************************************************************************

	@models

	+ Star, where repo=repo-uuid, comm=comm-uuid

************************************************************************************************************/

    all: function(req, done) {

        Star.find({
            repo: req.args.repo,
            comm: req.args.comm
        }, function(err, star) {

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

        Repo.with({
            uuid: req.args.repo
        }, function(err, repo) {

            Star.create({
                repo: req.args.repo,
                comm: req.args.comm,
                user: req.user.id,
                name: req.user.login
            }, function(err, star) {

                done(err, star);

            });

        });

    }

};
