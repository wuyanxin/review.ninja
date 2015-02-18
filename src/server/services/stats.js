var Action = require('mongoose').model('Action');

module.exports = (function () {

    var stats = {};

    stats.statsForUserAndRepo = function(user, repo, fnResult) {
        var s = {};
        var numStats = Object.keys(statQueries).length;

        // done ?
        var c = 0;
        for (sType in statQueries) {
            addTypeAndCount(sType, s, statQueries[sType].q(user, repo), function() {
                c++;
                if (c === numStats) {
                    fnResult(s);
                }
            });
        }
    };

    var addTypeAndCount = function(type, obj, query, fnDone) {
        query.count(function(err, count) {
            obj[type] = count;
            fnDone(err, count);
        });
    };

    var statQueries = {
        addStar: {
            q: function (user, repo) {
                return Action.where({
                    user: user,
                    repo: repo,
                    type: 'star:add'
                });
            }
        },
        removeStar: {
            q: function (user, repo) {
                return Action.where({
                    user: user,
                    repo: repo,
                    type: 'star:rmv'
                });
            }
        },
        addIssue: {
          q: function(user, repo) {
              return Action.where({
                  user: user,
                  repo: repo,
                  type: 'issues:add'
              });
          }
        },
        removeIssue: {
            q: function(user, repo) {
                return Action.where({
                    user: user,
                    repo: repo,
                    type: 'issues:rmv'
                });
            }
        },
        createComment: {
            q: function(user, repo) {
                return Action.where({
                    user: user,
                    repo: repo,
                    type: 'issues:createComment'
                });
            }
        },
        merge: {
            q: function(user, repo) {
                return Action.where({
                    user: user,
                    repo: repo,
                    type: 'pullRequests:merge'
                });
            }

        }
    };

    return stats;
})();