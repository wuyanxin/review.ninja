var express = require('express');
var path = require('path');

//////////////////////////////////////////////////////////////////////////////////////////////
// Default router
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.all('/*', function(req, res) {

	if(req.user) {
		return res.sendfile('index.html', {root: __dirname + './../../client'});
	}
	else {
		return res.sendfile('login.html', {root: __dirname + './../../client'});
	}
});

module.exports = router;