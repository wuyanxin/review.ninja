'use strict';
var Action = require('mongoose').model('Action');

module.exports = (function () {

    var addTypeAndCount = function(type, obj, query, fnDone) {
        query.count(function(err, count) {
            obj[type] = count;
            fnDone(err, count);
        });
    };

    var statQueries = {
        addStar: {
            q: function (uuid, user, repo) {
                return Action.where({
                    uuid: uuid,
                    user: user,
                    repo: repo,
                    type: 'star:add'
                });
            }
        },
        removeStar: {
            q: function (uuid, user, repo) {
                return Action.where({
                    uuid: uuid,
                    user: user,
                    repo: repo,
                    type: 'star:rmv'
                });
            }
        },
        createReviewThread: {
            q: function(uuid, user, repo) {
                return Action.where({
                    uuid: uuid,
                    user: user,
                    repo: repo,
                    type: 'pullRequests:createReviewThread'
                });
            }
        },
        createComment: {
            q: function(uuid, user, repo) {
                return Action.where({
                    uuid: uuid,
                    user: user,
                    repo: repo,
                    type: 'issues:createComment'
                });
            }
        },
        merge: {
            q: function(uuid, user, repo) {
                return Action.where({
                    uuid: uuid,
                    user: user,
                    repo: repo,
                    type: 'pullRequests:merge'
                });
            }

        }
    };

    var stats = {};

    stats.statsForUserAndRepo = function(uuid, user, repo, fnResult) {
        var s = {};
        var numStats = Object.keys(statQueries).length;

        // done ?
        var c = 0;
        var checkIfFinished = function() {
            c++;
            if (c === numStats) {
                fnResult(s);
            }
        };
        for (var sType in statQueries) {
            addTypeAndCount(sType, s, statQueries[sType].q(uuid, user, repo), checkIfFinished);
        }
    };

    return stats;
})();
