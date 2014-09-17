var express = require('express');

//////////////////////////////////////////////////////////////////////////////////////////////
// Default router
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.get('/accept', function(req, res) {

	req.user.terms = config.terms;

	req.user.save(function() {
		return res.redirect('/');
	});

});

router.all('/*', function(req, res) {

    if (req.isAuthenticated()) {

    	if(req.user.terms === config.terms) {
        	return res.sendfile('home.html', {root: __dirname + './../../client'});
    	}
    	else {
    		return res.sendfile('terms.html', {root: __dirname + './../../client'});
    	}
    }

    req.session.next = req.url;

    res.sendfile('login.html', {root: __dirname + './../../client'});

});

module.exports = router;
