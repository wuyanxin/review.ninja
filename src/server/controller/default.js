'use strict';
var express = require('express');
var fs = require('fs');
var ejs = require('ejs');
var request = require('request');
var github = require('../services/github');
var onboard = require('../services/onboard');

//////////////////////////////////////////////////////////////////////////////////////////////
// Default router
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.get('/accept', function(req, res) {
    var updateTerms = function() {
        models.User.update({
            uuid: req.user.id
        }, {
            terms: config.terms
        }, function(err, num, result) {
            res.redirect(req.session.next || '/');
            req.session.next = null;
        });
    }

    // to make sure a new repo is only created upon the first time user accepts terms
    // and not subsequent times user accepts terms
    models.User.findOne({
        uuid: req.user.id
    }, function(err, user) {
        if (!user.terms) {
            onboard.createRepo(req.user.token, req.user.login, function() {
                onboard.createFile(req.user.token, req.user.login, 'master', function() {
                    updateTerms();
                });
            });
        }
        else {
            updateTerms();
        }
    });
});

///TESTING ONLY
router.get('/testbranch', function(req, res) {
    // onboard.getBranchSha(req.user.login, function(sha) {
        // onboard.createBranch(req.user.token, req.user.login, sha, function() {
            onboard.getFileSha(req.user.login, function(sha) {
                onboard.updateFile(req.user.token, req.user.login, sha, 'quickedit', function() {
                    onboard.createPullRequest(req.user.token, req.user.login, function() {
                        res.redirect('/');
                    });
                });
            });
        // });
    // });
});

router.all('/*', function(req, res) {
    if (req.isAuthenticated()) {
        models.User.findOne({
            uuid: req.user.id
        }, function(err, user) {

            if(!user) {
                req.logout();
                return res.sendFile('login.html', {root: __dirname + './../../client'});
            }

            if(!config.terms || user.terms === config.terms) {
                return res.sendFile('home.html', {root: __dirname + './../../client'});
            }

            request(config.terms, function(err, response, rawGist) {
                github.call({
                    obj: 'markdown',
                    fun: 'render',
                    arg: {
                        text: rawGist
                    },
                    token: user.token
                }, function(err, renderedHtml) {

                    if(err) {
                        return res.sendFile('login.html', {root: __dirname + './../../client'});
                    }

                    req.session.next = req.path;
                    var template = fs.readFileSync('src/server/templates/terms.ejs', 'utf-8');
                    res.send(ejs.render(template, {termsHtml: renderedHtml.body}));
                });
            });
        });
    } else {
        req.session.next = req.path;
        res.sendFile('login.html', {root: __dirname + './../../client'});
    }
});

module.exports = router;
