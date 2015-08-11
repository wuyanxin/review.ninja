'use strict';

exports.id = '1.3.2';

exports.up = function(done) {
    var Settings = this.db.collection('settings');
    Settings.find({}).toArray(function(err, settings) {
        if(err) {
            return done(err);
        }
        settings.forEach(function(setting) {

            var notifications = setting.notifications || {};

            if(notifications && 'issue' in notifications) {
                notifications.review_thread = notifications.issue;
                delete notifications.issue;
            }

            Settings.update({_id: setting._id}, {
                $set: {
                    notifications: notifications
                }
            });
        });
        done();
    });
};
