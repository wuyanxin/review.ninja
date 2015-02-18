
module.exports = function(req, res, next) {
    var Action = require('mongoose').model('Action');

    if (req.originalUrl === '/api/star/rmv') {
        Action.create({
            user: req.args.user,
            repo: req.args.repo,
            type: 'star:rmv'
        });
    } else if (req.originalUrl === '/api/star/set') {
        Action.create({
            user: req.args.user,
            repo: req.args.repo,
            type: 'star:add'
        });
    } else if (req.originalUrl === '/api/issue/add') {
        Action.create({
            user: req.args.user,
            repo: req.args.repo,
            type: 'issues:add'
        });
    } else if (req.originalUrl === '/api/user/addRepo') {
        Action.create({
            user: req.args.user,
            repo: req.args.repo,
            type: 'user:addRepo'
        });
    } else if (req.originalUrl === '/api/github/call') {
        if (req.args.obj === 'issues' && req.args.fun === 'edit') {
            Action.create({
                user: req.args.arg.user,
                repo: req.args.arg.repo,
                type: 'issues:rmv'
            });
        } else if (req.args.obj === 'pullRequests' && req.args.fun === 'merge') {
            Action.create({
                user: req.args.arg.user,
                repo: req.args.arg.repo,
                type: 'pullRequests:merge'
            });
        }
    } else if (req.originalUrl === '/api/github/wrap') {
        if (req.args.obj === 'issues' && req.args.fun === 'createComment') {
            Action.create({
                user: req.args.arg.user,
                repo: req.args.arg.repo,
                type: 'issues:createComment'
            });
        }
    }
    next();
};
