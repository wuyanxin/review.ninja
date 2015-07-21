'use strict';

module.exports = function(req, res, next) {

    // models
    var Action = require('mongoose').model('Action');

    // put all the reviewninja api methods you want to track here, along with the type you want them to show up as in db
    var map = {
        '/api/star/rmv': 'star:rmv',
        '/api/star/set': 'star:add',
        '/api/user/addRepo': 'user:addRepo',
        '/api/onboard/dismiss': 'onboard:dismiss'
    };

    var githubMap = {
        'pullRequests:merge': 'pullRequests:merge',
        'issues:createComment': 'issues:createComment',
        'pullRequests:get': 'pullRequests:get'
    };

    // checks if the api call is github or not
    var isGitHub = function(url) {
        return (url.indexOf('/api/github/') > -1);
    };

    // choosing between github and regular
    var args = isGitHub(req.originalUrl) ? req.args.arg : req.args;
    var type = isGitHub(req.originalUrl) ? githubMap[req.args.obj + ':' + req.args.fun] : map[req.originalUrl];

    if(type) {
        Action.create({
            uuid: req.user.id,
            user: args.user,
            repo: args.repo,
            type: type
        });

        // trigger webhook
        io.emit('action:' + req.user.id, {});
    }

    next();
};
