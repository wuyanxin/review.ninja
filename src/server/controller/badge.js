'use strict';
var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var router = express.Router();

// services
var github = require('../services/github');
var pullRequest = require('../services/pullRequest');

// models
var Star = require('mongoose').model('Star');

//////////////////////////////////////////////////////////////////////////////////////////////
// Badge controller
//////////////////////////////////////////////////////////////////////////////////////////////

router.all('/:repoId/pull/:number/badge', function(req, res) {

    //
    // Helper functions
    //

    function addAuth(options) {
        if(config.server.github.user && config.server.github.pass) {
            options.basicAuth = {
                user: config.server.github.user,
                pass: config.server.github.pass
            };
        }
    }

    var options = {
        obj: 'repos',
        fun: 'one',
        arg: {
            id: req.params.repoId
        }
    };
    addAuth(options);

    github.call(options, function(err, githubRepo) {
        if(err) {
            return res.status(304).send();
        }

        var options = {
            obj: 'pullRequests',
            fun: 'get',
            arg: {
                user: githubRepo.owner.login,
                repo: githubRepo.name,
                number: req.params.number
            }
        };
        addAuth(options);

        github.call(options, function(err, githubPullRequest) {
            if(err) {
                return res.status(304).send();
            }

            var args = {
                sha: githubPullRequest.head.sha,
                user: githubRepo.owner.login,
                repo: githubRepo.name,
                number: req.params.number,
                repo_uuid: req.params.repoId
            };
            addAuth(args);

            pullRequest.status(args, function(err, status) {

                var hash = require('crypto').createHash('md5').update(status.stars + ':' + status.issues.open, 'utf8').digest('hex');

                if(req.get('If-None-Match') === hash) {
                    return res.status(304).send();
                }

                res.set('Content-Type', 'image/svg+xml');
                res.set('Cache-Control', 'no-cache');
                res.set('Etag', hash);

                var tmp = fs.readFileSync('src/server/templates/badge.svg', 'utf-8');
                var svg = ejs.render(tmp, {stars: status.stars, openIssues: status.issues.open});
                res.send(svg);

            });
        });
    });
});

router.all('/:repoId/badge', function(req, res) {

    Star.count({
        repo: req.params.repoId
    }, function(err, count) {

        count = count || 0;

        res.redirect('https://img.shields.io/badge/Ninja stars-' + count + '-3e9a94.svg');

    });

});

module.exports = router;
