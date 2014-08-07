var express = require('express');

//////////////////////////////////////////////////////////////////////////////////////////////
// Default router
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.all('/*', function(req, res) {

    if (req.isAuthenticated()) {
        return res.render('home.html', {
            user: req.user
        });
    }

    if (config.github.enterprise) {
        return res.render('login.enterprise.html');
    }

    return res.render('login.html');
});

module.exports = router;
