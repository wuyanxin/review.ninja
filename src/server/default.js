var express = require('express');
var path = require('path');

//////////////////////////////////////////////////////////////////////////////////////////////
// Default router
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.all('/*', function(req, res) {

	if(req.user) {
		return res.sendfile('home.html', {root: __dirname + '/../client'});
	}
	else {
		return res.redirect('/login.html');
	}
});

module.exports = router;