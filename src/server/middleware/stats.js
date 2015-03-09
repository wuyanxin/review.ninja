'use strict';

module.exports = function(req, res, next) {

    // models
    var Action = require('mongoose').model('Action');

    if (req.originalUrl === '/api/star/rmv') {
        Action.create({
            uuid: req.user.id,
            user: req.args.user,
            repo: req.args.repo,
            type: 'star:rmv'
        });
    } else if (req.originalUrl === '/api/star/set') {
        Action.create({
            uuid: req.user.id,
            user: req.args.user,
            repo: req.args.repo,
            type: 'star:add'
        });
    } else if (req.originalUrl === '/api/issue/add') {
        Action.create({
            uuid: req.user.id,
            user: req.args.user,
            repo: req.args.repo,
            type: 'issues:add'
        });
    } else if (req.originalUrl === '/api/user/addRepo') {
        Action.create({
            uuid: req.user.id,
            user: req.args.user,
            repo: req.args.repo,
            type: 'user:addRepo'
        });
    } else if (req.originalUrl === '/api/github/call') {
        if (req.args.obj === 'issues' && req.args.fun === 'edit') {
            Action.create({
                uuid: req.user.id,
                user: req.args.arg.user,
                repo: req.args.arg.repo,
                type: 'issues:' + req.args.arg.state
            });
        } else if (req.args.obj === 'pullRequests' && req.args.fun === 'merge') {
            Action.create({
                uuid: req.user.id,
                user: req.args.arg.user,
                repo: req.args.arg.repo,
                type: 'pullRequests:merge'
            });
        }
    } else if (req.originalUrl === '/api/github/wrap') {
        if (req.args.obj === 'issues' && req.args.fun === 'createComment') {
            Action.create({
                uuid: req.user.id,
                user: req.args.arg.user,
                repo: req.args.arg.repo,
                type: 'issues:createComment'
            });
        }
    }
    next();
};
