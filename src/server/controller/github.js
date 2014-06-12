var express = require('express');
// models
var Repo = require('mongoose').model('Repo');

//////////////////////////////////////////////////////////////////////////////////////////////
// Github controller
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.all('/github/webhook', function(req, res) {

	var uuid = req.body.repository.id;
	var name = req.body.repository.name;
	var user = req.body.repository.owner.name;

	Repo.findOneAndUpdate({uuid: uuid}, {uuid: uuid, name: name, user: user}, {upsert: true}, function(err, repo) {

		
		
	});

	res.send(200);
});

module.exports = router;