'use strict';
var github = require('./github');

module.exports = {
    ghost: function(object, token, done) {
        if(!object) {
            github.call({
                obj: 'user',
                fun: 'getFrom',
                arg: {
                    user: 'ghost'
                },
                token: token
            }, function(err, ghost) {
                if(!err) {
                    object = ghost;
                }
                done(err, object);
            });
        } else {
            done(null, object);
        }
    }
};
