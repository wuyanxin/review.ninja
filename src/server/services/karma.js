var Action = require('mongoose').model('Action');

module.exports = (function () {

    var karma = {};

    karma.karmaForUserAndRepo = function(user, repo, fnResult) {
        var results = [];
        var done = 0;
        getModifiers().forEach(function(m) {
            if (queryExistsForModifier(m.type)) {
                getModifierCount(m.type, user, repo, function(result) {
                    done++;
                    results.push(result);
                    if (done == getModifiers().length) {
                        fnResult(getRankForModifierCount(results));
                    }
                });
            }
        });
    };

    var getRankForModifierCount = function(modifierCounts) {
        var kPoints = 0;
        var karma = {};
        modifierCounts.forEach(function(mPair) {
            kPoints += mPair.count;
            karma[mPair.type] = mPair.count;
        });
        karma.karmaPoints = kPoints;
        karma.ninjaRank = toRank(kPoints);
        return karma;
    };

    var getModifiers = function() {
        return config.server.karma.modifiers;
    };

    var getModifierCount = function(type, user, repo, fnResult) {
        modifierPromiseMap[type].q(user, repo).count(function(err, count) {
            fnResult({ type: type, count: count });
        });
    };

    var queryExistsForModifier = function(m) {
        return !! modifierPromiseMap[m];
    };

    var toRank = function (karmaPoints) {
        var ranks = config.server.karma.ranks;
        var last = ranks.length - 1;
        var first = 0;

        // Boundary cases
        if (karmaPoints >= ranks[last].end) {
            return ranks[last];
        }
        if (karmaPoints < ranks[first].start) {
            return ranks[first];
        }
        // Otherwise search
        for (var i = 0; i < ranks.length; i++) {
            if (karmaPoints >= ranks[i].start
                && karmaPoints < ranks[i].end) {
                return ranks[i];
            }
        }
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
