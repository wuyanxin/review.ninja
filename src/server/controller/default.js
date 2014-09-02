var express = require('express');

//////////////////////////////////////////////////////////////////////////////////////////////
// Default router
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.all('/*', function(req, res) {

    if (req.isAuthenticated()) {
        return res.sendfile('home.html', {root: __dirname + './../../client'});
    }

    req.session.next = req.url;

    // enterprise marketing page
    if (config.server.github.enterprise) {
        return res.sendfile('login.html', {root: __dirname + './../../client'});
    }

    return res.redirect(config.server.marketingPage);
});

module.exports = router;
