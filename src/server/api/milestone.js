// models
var Milestone = require('mongoose').model('Milestone');

// modules
var github = require('../services/github');

module.exports = {


    /************************************************************************************************************

    @models

    + Star, where repo=repo, pull=pull

    ************************************************************************************************************/

    get: function(req, done) {
        Milestone.findOne({
            pull: req.args.pull,
            repo: req.args.repo_uuid
        }, function(err, milestone) {

            if(err || milestone) {
                return done(err, milestone);
            }

            // create milestone if non-existant
            github.call({
                obj: 'issues',
                fun: 'createMilestone',
                arg: {
                    user: req.args.user,
                    repo: req.args.repo,
                    title: 'Pull Request #' + req.args.pull
                },
                token: req.user.token
            }, function(err, milestone) {
                if(err) {
                    return done(err);
                }

                Milestone.create({
                    pull: req.args.pull,
                    repo: req.args.repo_uuid,
                    number: milestone.number
                }, done);
            });
        });
    }
};
