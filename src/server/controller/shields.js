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

router.all('/badge/:user/:repo/:refs?', function(req, res) {

    var user = req.params.user;
    var repo = req.params.repo;
    var refs = req.params.refs || 'master';

    Repo.with({
        user: user,
        repo: repo
    }, function(err, grepo, mrepo) {

        Comm.with({
            user: user,
            repo: repo,
            refs: refs
        }, function(err, gcomm, mcomm) {

            status = mcomm ? mcomm.status : 'none';

            res.redirect('http://img.shields.io/badge/review.ninja-' + status + '-' + COLORS[status] + '.svg');

        });

    });

});

module.exports = router;

//////////////////////////////////////////////////////////////////////////////////////////////
// Local helper
//////////////////////////////////////////////////////////////////////////////////////////////

var Repo = {
    with: function(args, done) {

        var github = require('../services/github');
        var mongod = require('mongoose').model('Repo');

        github.call({
            obj: 'repos',
            fun: 'get',
            arg: {
                user: args.user,
                repo: args.repo
            }
        }, function(err, grepo) {

            if (!err) {

                mongod.with({
                    uuid: grepo.id
                }, function(err, mrepo) {

                    done(null, grepo, mrepo);

                });
            }

        });

    }
};

var Comm = {
    with: function(args, done) {

        var github = require('../services/github');
        var mongod = require('mongoose').model('Comm');

        github.call({
            obj: 'repos',
            fun: 'getCommit',
            arg: {
                user: args.user,
                repo: args.repo,
                sha: args.refs
            }
        }, function(err, gcomm) {

            if (!err) {

                mongod.with({
                    uuid: gcomm.sha
                }, function(err, mcomm) {

                    done(null, gcomm, mcomm);

                });
            }

        });

    }
};
