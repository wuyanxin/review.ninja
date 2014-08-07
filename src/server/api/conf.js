// models
var Conf = require('mongoose').model('Conf');

module.exports = {

/************************************************************************************************************

	@models

	+ Conf, where user=user-uuid, repo=repo-uuid

************************************************************************************************************/

    get: function(req, done) {

        Conf.findOne({
            user: req.args.user,
            repo: req.args.repo
        }, function(err, conf) {

            done(err, conf);

        });

    }

};