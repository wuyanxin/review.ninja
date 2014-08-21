// modules
var async = require('async');
var parse = require('parse-diff');

// models
var Star = require('mongoose').model('Star');
var Conf = require('mongoose').model('Conf');

module.exports = {

    get: function(req, pull, done) {

        Star.find({repo: pull.base.repo.id, comm: pull.head.sha}, function(err, stars) {

            pull.stars = [];

            if(!err) {
                pull.stars = stars;
            }

            done(err, pull);
        });
    },
    
    getFiles: function(req, files, done) {
        files.forEach(function(file) {
            try {
                file.patch = parse(file.patch);
            }
            catch(ex) {
                file.patch = null;
            }
        });

        done(null, files);
    },

    getAll: function(req, pulls, done) {

            var repo;

            try {
                repo = pulls[0].base.repo.id;
            }
            catch(ex) {
                repo = null;
            }

            Conf.findOne({
                user: req.user.id,
                repo: repo
            }, function(err, conf) {

                // set the watched pulls
                if(conf) {
                    pulls.forEach(function(pull) {
                        pull.watched = false;
                        for(var i=0; i<conf.watch.length; i++) {
                            var re = RegExp(conf.watch[i], 'g');
                            if(re.exec(pull.base.ref) || re.exec(pull.head.ref)) {
                                pull.watched = true;
                                break;
                            }
                        }
                    });
                }

                // set the stars
                async.each(pulls, function(pull, call) {
                    Star.find({repo: pull.base.repo.id, comm: pull.head.sha}, function(err, stars) {
                        pull.stars = [];
                        if(!err) {
                            pull.stars = stars;
                        }
                        return call(null);
                    });
                }, function() {
                    done(err, pulls);
                });
            });
    }
};
