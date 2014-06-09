
var passport = require('passport');
var express = require('express');

//////////////////////////////////////////////////////////////////////////////////////////////
// User controller
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.get('/', function(req, res) {
	if(req.user) {
		return res.redirect('/home.html');
	}
	else {
		return res.redirect('/login.html');
	}
});

router.get('/auth/github',
	function(req, res, next) {
		req.session.next = req.query.next;
		passport.authenticate('github')(req, res, next);
	}
);

router.get('/auth/github/callback',
	passport.authenticate('github', { failureRedirect: '/' }),
	function(req, res) {
		if(req.session.next) {
			res.redirect('/home.html#' + req.session.next);
		}
		else {
			res.redirect('/home.html#');
		}
		delete req.session.next;
	}
);

module.exports = router;