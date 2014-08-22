// models
var Settings = require('mongoose').model('Settings');

module.exports = {

    /************************************************************************************************************

        Provide brief description here

        @models

        + Settings, where user=user-uuid, repo=repo-uuid

        @github (if needed)

    ************************************************************************************************************/
    
    get: function(req, done) {
        var args = {
            user: req.user.id,
            repo: req.args.repo
        };

        Settings.with(args, function(err, settings) {

            // occurs when user does not have any
            // settings on this repo yet
            if(!settings) {
                Settings.with(args, {}, function(err, settings) {
                    done(err, settings);
                });
                return;
            }
            done(err, settings);
        });
    },

    setWatched: function(req, done) {
        Settings.with({
            user: req.user.id,
            repo: req.args.repo
        }, {
            watched: req.args.watched
        }, function(err, settings) {
            done(err, settings);
        });
    },

    setNotifications: function(req, done) {
        Settings.with({
            user: req.user.id,
            repo: req.args.repo
        }, {
            notifications: req.args.notifications
        }, function(err, settings) {
            done(err, settings);
        });
    }

};
