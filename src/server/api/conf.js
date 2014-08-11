// models
var Conf = require('mongoose').model('Conf');

module.exports = {

/************************************************************************************************************

	@models

	+ Conf, where user=user-uuid, repo=repo-uuid

************************************************************************************************************/

    all: function(req, done) {
        Conf.findOne({
            user: req.user.id,
            repo: req.args.repo
        }, function(err, conf) {
            done(err, conf);
        });
    },

    addWatch: function(req, done) {
        Conf.with({
            user: req.user.id,
            repo: req.args.repo
        }, function(err, conf) {

            var watches = {};
            conf.watch.forEach(function(watch) {
                watches[watch] = true;
            });
            watches[req.args.watch] = true;
            conf.watch = [];
            for (var key in watches) {
                if (watches.hasOwnProperty(key) && watches[key]) {
                    conf.watch.push(key);
                }
            }
            console.log(conf.watch);

            Conf.with({
                user: req.user.id,
                repo: req.args.repo
            }, {
                watch: conf.watch
            }, function(err, conf) {
                done(err, conf);
            });
        });
    },

    removeWatch: function(req, done) {
        Conf.with({
            user: req.user.id,
            repo: req.args.repo
        }, function(err, conf) {

            var watches = {};
            conf.watch.forEach(function(watch) {
                watches[watch] = true;
            });
            watches[req.args.watch] = false;
            conf.watch = [];
            for (var key in watches) {
                if (watches.hasOwnProperty(key) && watches[key]) {
                    conf.watch.push(key);
                }
            }

            Conf.with({
                user: req.user.id,
                repo: req.args.repo
            }, {
                watch: conf.watch
            }, function(err, conf) {
                done(err, conf);
            });
        });
    },

    setNotifications: function(req, done) {
        var notifications = {
            pull_request: req.args.notifications.pull_request,
            issue: req.args.notifications.issue,
            star: req.args.notifications.star
        };

        Conf.with({
            user: req.user.id,
            repo: req.args.repo
        }, {
            notifications: notifications
        }, function(err, conf) {
            done(err, conf);
        });
    }

};
