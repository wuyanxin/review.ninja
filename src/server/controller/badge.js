var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var crypto = require('crypto');

//////////////////////////////////////////////////////////////////////////////////////////////
// Badge controller
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();
var github = require('../services/github');
var Star = require('mongoose').model('Star');

router.all('/:repoId/pull/:number/badge', function(req, res) {
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
            return res.send(err);
        }
        var options = {
            obj: 'issues',
            fun: 'repoIssues',
            arg: {
                user: githubRepo.owner.login,
                repo: githubRepo.name,
                labels: 'pull-request-' + req.params.number,
                state: 'open'
            }
        };
        addAuth(options);
        github.call(options, function(err, issues) {
            if(err) {
                return res.send(err);
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
                Star.find({sha: githubPullRequest.head.sha, repo: githubRepo.id}, function(err, stars) {
                    if(err) {
                        return res.send(err);
                    }
                    var issuesLengthHash = crypto.createHash('md5').update(issues.length.toString(), 'utf8').digest('hex');
                    var starsLengthHash = crypto.createHash('md5').update(stars.length.toString(), 'utf8').digest('hex');
                    var hash = crypto.createHash('md5').update(issuesLengthHash + starsLengthHash, 'utf8').digest('hex');

                    if(req.get('If-None-Match') === hash) {
                        return res.status(304).send();
                    }

                    res.set('Content-Type', 'image/svg+xml');
                    res.set('Cache-Control', 'no-cache');
                    res.set('Etag', hash);

                    var tmp = fs.readFileSync('src/server/templates/badge.svg', 'utf-8');
                    var svg = ejs.render(tmp, {openIssues: issues.length, stars: stars.length});
                    res.send(svg);
                });
            });
        });
    });
});

module.exports = router;
