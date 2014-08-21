// module
var github = require('../services/github');
var merge = require('merge');
var path = require('path');

module.exports = {

    /************************************************************************************************************

    @github

    + <req.obj>.<req.fun>

************************************************************************************************************/

    call: function(req, done) {
        
        github.call(merge(req.args, {
            token: req.user.token
        }), function(err, res, meta) {
            done(err, {
                data: res,
                meta: meta
            });
        });
    },

    wrap: function(req, done) {
        
        github.call(merge(req.args, {
            token: req.user.token
        }), function(err, res, meta) {

            if(err) {
                return done(err, {
                    data: res,
                    meta: meta
                });
            }

            // try catch block here

            var wrap = require( path.join('../wrap', req.args.obj) );

            if(!wrap[req.args.fun]) {
                return done('Wrapper not found');
            }

            wrap[req.args.fun](req, res, function(err, res) {
                done(err, {
                    data: res,
                    meta: meta
                });
            });
        });
    }
};
