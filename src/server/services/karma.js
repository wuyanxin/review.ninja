var Action = require('mongoose').model('Action');

module.exports = (function () {

    var karma = {};

    karma.rankForUserAndRepo = function (user, repo, fnResult) {
        var results = [];
        var done = 0;
        // Only use queries that have modifiers set in the config
        for (var i = 0; i < config.server.karma.modifiers.length; i++) {
            var m = config.server.karma.modifiers[i].type;
            if (modifierPromiseMap[m]) {
                queryToCountScore(m, modifierPromiseMap[m].q(user, repo), function(obj) {
                    done++;
                    results.push(obj);
                    if (done === config.server.karma.modifiers.length) {
                        fnResult(addRank(results));
                    }
                });
            }
        }
    };

    var addRank = function(scoreModifierPairs) {
        var score = 0;
        for (var i = 0; i < scoreModifierPairs.length; i++) {
            score += scoreModifierPairs[i].count;
        }
        var karma = {}
        karma.details = scoreModifierPairs;
        karma.total = score;
        karma.rank = toRank(score);
        return karma;
    };

    var toRank = function (score) {
        var ranks = config.server.karma.ranks;

        for (var i = 0; i < ranks.length; i++) {
            if (score >= ranks[i].start
                && score < ranks[i].end) {
                return ranks[i];
            }
        }
    };

    var queryToCountScore = function(type, query, fnCallback) {
        query.count(function(err, count) {
            fnCallback({ type: type, count: count });
        });
    };

    var modifierPromiseMap = {
        star: {
            q: function (user, repo) {
                return Action.where({
                    user: user,
                    repo: repo
                }).and([
                    { $or: [{type: 'star:add'}, {type: 'star:rmv'}]}
                ]);
            }
        },
        issue: {
            q: function (user, repo) {
                return Action.where({
                    user: user,
                    repo: repo
                }).and([
                    { $or: [{type: 'issues:add'}, {type: 'issues:rmv'}, {type: 'issues:createComment'}]}
                ]);
            }
        },
        repo: {
            q: function (user, repo) {
                return Action.where({
                    user: user,
                    repo: repo,
                    type: 'user:addRepo'
                });
            }
        }
        // TODO: merge with no issues
    };

    return karma;
})();
