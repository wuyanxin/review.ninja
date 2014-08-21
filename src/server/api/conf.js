// models
var Conf = require('mongoose').model('Conf');

module.exports = {

    /************************************************************************************************************

        Provide brief description here

        @models

        + Conf, where user=user-uuid, repo=repo-uuid

        @github (if needed)

    ************************************************************************************************************/
    
    // RENAME TO GET
    // SHOULD USE CONF.WITH INSTEAD OF CONF.FINDONE

    all: function(req, done) {
        Conf.findOne({
            user: req.user.id,
            repo: req.args.repo
        }, function(err, conf) {
            done(err, conf);
        });
    },


    // + SET WATCHED
    // - ADDWATCH, REMOVEWATCH
    // EXPLICITY DEFINE JSON SCHEMA IN MODEL

    addWatch: function(req, done) {
        Conf.with({
            user: req.user.id,
            repo: req.args.repo
        }, function(err, conf) {

            // LIPSTICK - EXPLAIN WHATS GOING ON HERE
            // CREATE NEW CONF AND SAVE
            if(!conf) {
                conf = {
                    watch: []
                };
            }
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
