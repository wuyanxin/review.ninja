// models
var Repo = require('mongoose').model('Repo');

module.exports = {

    get: function(req, done) {
        Repo.findOne({repo: req.args.repo_uuid}, function(err, repo) {

            if(repo) {
                return done(err, repo);
            }

            Repo.create({
                repo: req.args.repo_uuid
            }, done);
        });
    },

    setComment: function(req, done) {
        Repo.findOneAndUpdate({
            repo: req.args.repo_uuid
        }, {
            comment: req.args.comment
        }, {}, done);
    },

    setThreshold: function(req, done) {
        Repo.findOneAndUpdate({
            repo: req.args.repo_uuid
        }, {
            threshold: req.args.threshold
        }, {}, done);
    }

};
