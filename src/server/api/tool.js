// models
var Tool = require('mongoose').model('Tool');

module.exports = {

    /************************************************************************************************************

	@models

	+ Tool, where repo=repo-uuid

************************************************************************************************************/

    all: function(req, done) {

        Tool.find({
            repo: req.args.repo
        }, function(err, tool) {

            done(err, tool);

        });

    },

    /************************************************************************************************************

	@models

	+ Tool

************************************************************************************************************/

    add: function(req, done) {

        Tool.create({
            repo: req.args.repo,
            name: req.args.name
        }, function(err, tool) {

            done(err, tool);

        });

    },

    /************************************************************************************************************

	@models

	+ Tool, where id=id

************************************************************************************************************/

    get: function(req, done) {

        Tool.findById(req.args.id, function(err, tool) {

            done(err, tool);

        });

    },

    /************************************************************************************************************

	@models

	+ Tool, where id=id

************************************************************************************************************/

    set: function(req, done) {

		Tool.findById(req.args.id, function(err, tool) {

			if (err) {
                return done({code: 404, text: 'Not found'});
			}
			
			tool.name = req.args.name || tool.name;

			tool.save(function(err, tool) {
				
				done(err, tool);

            });

        });

    },

    /************************************************************************************************************

	@models

	+ Tool, where id=id

    ************************************************************************************************************/

    rmv: function(req, done) {
        Tool.findById(req.args.id, function(err, tool) {
            if(!err && tool) {
                tool.remove(function(err, tool) {
                    done(err, tool);
                });
            }
        });
    }

};
