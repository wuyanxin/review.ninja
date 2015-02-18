
module.exports = function(req, res, next) {
    var Action = require('mongoose').model('Action');

    if ('/api/star/rmv' === req.originalUrl) {
        Action.create({
            user: req.args.user,
            repo: req.args.repo,
            type: 'star:rmv'
        });
    } else if ('/api/star/set' === req.originalUrl) {
        Action.create({
            user: req.args.user,
            repo: req.args.repo,
            type: 'star:add'
        });
    } else if ('/api/issue/add' === req.originalUrl) {
        Action.create({
            user: req.args.user,
            repo: req.args.repo,
            type: 'issues:add'
        });
    } else if ('/api/user/addRepo' === req.originalUrl) {
        Action.create({
            user: req.args.user,
            repo: req.args.repo,
            type: 'user:addRepo'
        });
    } else if ('/api/github/call' === req.originalUrl) {
        if (req.args.obj === 'issues' && req.args.fun === 'edit') {
            Action.create({
                user: req.args.arg.user,
                repo: req.args.arg.repo,
                type: 'issues:rmv'
            })
        } else if (req.args.obj === 'pullRequests' && req.args.fun === 'merge') {
            Action.create({
                user: req.args.arg.user,
                repo: req.args.arg.repo,
                type: 'pullRequests:merge'
            });
        }
    } else if ('/api/github/wrap' === req.originalUrl) {
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
