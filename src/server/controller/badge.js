var express = require('express'),
    ejs = require('ejs'),
    fs = require('fs');

//////////////////////////////////////////////////////////////////////////////////////////////
// Badge controller
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();
var github = require('../services/github');
var Star = require('mongoose').model('Star');

router.all('/:repoId/badge', function(req, res) {
    res.set('Content-Type', 'image/svg+xml');
    var tmp = fs.readFileSync("src/server/templates/badge.svg", 'utf-8');
    var svg = ejs.render(tmp, {});
    res.send(svg);
});

router.all('/:repoId/pull/:number/badge', function(req, res) {
    github.call({
        obj: 'repos',
        fun: 'one',
        arg: {
            id: req.params.repoId
        }
    }, function(err, githubRepo) {
        if(err) {
            return res.send(err);
        }

        github.call({
            obj: 'issues',
            fun: 'repoIssues',
            arg: {
                user: githubRepo.owner.login,
                repo: githubRepo.name,
                labels: 'review.ninja,pull-request-' + req.params.number,
                state: 'open'
            }
        }, function(err, issues) {
            if(err) {
                return res.send(err);
            }

            github.call({
                obj: 'pullRequests',
                fun: 'get',
                arg: {
                    user: githubRepo.owner.login,
                    repo: githubRepo.name,
                    number: req.params.number
                }
            }, function(err, githubPullRequest) {
                Star.find({sha: githubPullRequest.head.sha, repo: githubRepo.id}, function(err, stars) {
                    if(err) {
                        return res.send(err);
                    }
                    
                    res.set('Content-Type', 'image/svg+xml');
                    var tmp = fs.readFileSync("src/server/templates/badge.svg", 'utf-8');
                    var svg = ejs.render(tmp, {openIssues: issues.length, stars: stars.length});
                    res.send(svg);
                });
            });
        });
    });
});

module.exports = router;
