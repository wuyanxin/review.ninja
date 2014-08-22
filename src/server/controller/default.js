var express = require('express');

//////////////////////////////////////////////////////////////////////////////////////////////
// Default router
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.all('/*', function(req, res) {

    if (req.isAuthenticated()) {
        return res.sendfile('home.html', {root: __dirname + './../../client'});
    }

    // todo: redirect to marketing page
    if (config.server.github.enterprise) {
        return res.render('login.enterprise.html');
    }

    return res.sendfile('login.html', {root: __dirname + './../../client'});
});

module.exports = router;
