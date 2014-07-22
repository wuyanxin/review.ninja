// module
var github = require('../services/github');
var merge = require('merge');

module.exports = {

/************************************************************************************************************

    @github

    + <req.obj>.<req.fun>

************************************************************************************************************/

	call: function(req, done) {
		github.call(merge(req.args, {token: req.user.token}), function(err, res, meta) {
			done(err, {
				data: res,
				meta: meta
			});
		});
	}

};