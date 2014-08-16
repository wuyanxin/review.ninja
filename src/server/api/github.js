// module
var github = require('../services/github');
var merge = require('merge');

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
                return done(err);
            }

            var wrap = require('../wrap/' + req.args.obj);

            wrap[req.args.fun](req.args.arg, res, function(err, res) {
                done(err, {
                    data: res,
                    meta: meta
                });
            });
        });
    }
};
