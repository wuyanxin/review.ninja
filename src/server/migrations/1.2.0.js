'use strict';
exports.id = '1.2.0';

exports.up = function (done) {
    var Users = this.db.collection('users');
    Users.find({}).toArray(function(err, users) {
        if(err) {
            return done(err);
        }
        users.forEach(function(user) {
           Users.update({uuid: user.uuid}, {
            $set: {
              history: { welcome: true, taskbar: true }
            }
           });
        });
        done();
    });
};
