var passport = require('passport');
var express = require('express');
var path = require('path');

//////////////////////////////////////////////////////////////////////////////////////////////
// User controller
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

// services
var url = require('../services/url');
var regex = new RegExp(url.baseUrl);

router.get('/auth/github',
    function(req, res, next) {
        req.session.referer = req.headers.referer;
        var scope = req.query.private === 'true' ? config.server.github.private_scope : config.server.github.public_scope;
        passport.authenticate('github', {scope: scope})(req, res, next);
    }
);

router.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/'
    }),
    function(req, res, next) {
        var redirect = '/';
        if(regex.exec(req.session.referer)) {
            redirect = req.session.referer;
        }

        res.redirect(redirect);
        req.session.referer = null;
    }
);

router.get('/logout',
    function(req, res, next) {
        req.logout();
        res.redirect('/');
    }
);

module.exports = router;
