// models
var Settings = require('mongoose').model('Settings');

module.exports = {

    /************************************************************************************************************

        Provide brief description here

        @models

        + Settings, where user=user_uuid, repo=repo_uuid

        @github (if needed)

    ************************************************************************************************************/
    
    get: function(req, done) {

        Settings.with({user: req.user.id, repo: req.args.repo_uuid}, function(err, settings) {

            if(settings) {
                return done(err, settings);
            }

            Settings.with({user: req.user.id, repo: req.args.repo_uuid}, {}, function(err, settings) {
                done(err, settings);
            });
        });
    },

    setWatched: function(req, done) {
        // unique the watched array
        // taken from stackoverflow: http://stackoverflow.com/questions/1890203/unique-for-arrays-in-javascript
        var hash = {}, result = [], arr = req.args.watched;
        for ( var i = 0, l = arr.length; i < l; ++i ) {
            if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
                hash[arr[i]] = true;
                result.push(arr[i]);
            }
        }

        Settings.with({
            user: req.user.id,
            repo: req.args.repo_uuid
        }, {
            watched: result
        }, function(err, settings) {
            done(err, settings);
        });
    },

    setNotifications: function(req, done) {
        Settings.with({
            user: req.user.id,
            repo: req.args.repo_uuid
        }, {
            notifications: req.args.notifications
        }, function(err, settings) {
            done(err, settings);
        });
    }

};
