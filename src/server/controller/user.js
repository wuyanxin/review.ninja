var passport = require('passport');
var express = require('express');
var path = require('path');

//////////////////////////////////////////////////////////////////////////////////////////////
// User controller
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.get('/auth/github',
    function(req, res, next) {
        passport.authenticate('github')(req, res, next);
    }
);

router.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/'
    }),
    function(req, res) {
        res.redirect('/' + req.session.next ? req.session.next : '');
        delete req.session.next;
    }
);

router.get('/logout',
    function(req, res, next) {
        req.logout();
        res.redirect('/');
    }
);

module.exports = router;
