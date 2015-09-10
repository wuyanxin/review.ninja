'use strict';

// modules
var express = require('express');

var router = express.Router();

router.all('/config', function(req, res) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({
        terms: config.terms,
        gacode: config.client.gacode,
        survey: config.client.survey,
        enterprise: config.server.github.enterprise,
        slack: !!config.server.slack.host
    }));
});

module.exports = router;
