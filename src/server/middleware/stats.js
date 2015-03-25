'use strict';

module.exports = function(req, res, next) {

    // models
    var Action = require('mongoose').model('Action');

    // put all the reviewninja api methods you want to track here, along with the type you want them to show up as in db
    var regularMap = {
        '/api/star/rmv': 'star:rmv',
        '/api/star/set': 'star:add',
        '/api/issue/add': 'issues:add',
        '/api/user/addRepo': 'user:addRepo'
    };

    // put all the github api methods you want to track here
    var trackedGithubMethods = ['issues:closed', 'pullRequests:merge', 'issues:createComment'];

    // checks if the api call is github or not
    var isGitHub = function(url) {
        return (url.indexOf('/api/github/') > -1);
    };

    // adding to db for non-github methods
    var regularFunc = function() {
        if (req.originalUrl in regularMap) {
            Action.create({
                uuid: req.user.id,
                user: req.args.user,
                repo: req.args.repo,
                type: regularMap[req.originalUrl]
            });
        }
    };

    // adding to db for github methods
    var githubFunc = function() {
        if (trackedGithubMethods.indexOf((req.args.obj + ':' + req.args.fun)) > -1) {
            Action.create({
                uuid: req.user.id,
                uesr: req.args.arg.user,
                repo: req.args.arg.repo,
                type: req.args.obj + ':' + req.args.fun
            });
        } else if (req.args.obj === 'pullRequests' && req.args.fun === 'get') {
            Action.create({
                uuid: req.user.id,
                user: req.args.arg.user,
                repo: req.args.arg.repo,
                type: 'pullRequests:get'
            });
        }
    };

    // choosing between github and regular
    if (!isGitHub(req.originalUrl)) {
        regularFunc();
    } else {
        githubFunc();
    }

    next();
};
