var express = require('express');

var COLORS = {
    none: 'lightgrey',
    pending: 'blue',
    rejected: 'red',
    approved: 'brightgreen'
};

//////////////////////////////////////////////////////////////////////////////////////////////
// Default router
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.all('/badge/repo/:repo', function(req, res) {

    // ...

    var tmp = fs.readFileSync("...", 'utf-8');

    var svg = ejs.render(tmp, arg);

});

router.all('/badge/pull/:pull', function(req, res) {

    // ...

    var tmp = fs.readFileSync("...", 'utf-8');

    var svg = ejs.render(tmp, arg);

});

module.exports = router;
