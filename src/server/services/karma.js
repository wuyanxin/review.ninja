var Keen = require('keen-js');
var keenio = require('../services/keenio');

module.exports = (function () {

    var karma = {};

    var toRank = function (kP) {
        var ranks = config.server.karma.ranks;

        for (var i = 0; i < ranks.length; i++) {
            if (kP >= ranks[i].start
                && kP < ranks[i].end) {
                return ranks[i];
            }
        }
    };

    var modifierQueryMap = {
        star: {
            q: function (userId, repoId) {
                return [
                    new Keen.Query("count", {
                        eventCollection: "star:rmv",
                        filters: [
                            {"property_name": "user", "operator": "eq", "property_value": userId},
                            {"property_name": "repo", "operator": "eq", "property_value": repoId}
                        ]
                    }),
                    new Keen.Query("count", {
                        eventCollection: "star:create",
                        filters: [
                            {"property_name": "user", "operator": "eq", "property_value": userId},
                            {"property_name": "repo", "operator": "eq", "property_value": repoId}
                        ]
                    })
                ];
            },
            c: 2
        },
        issue: {
            q: function (userId, repoId) {
                return [
                    new Keen.Query("count", {
                        eventCollection: "issue:add",
                        filters: [
                            {"property_name": "user", "operator": "eq", "property_value": userId},
                            {"property_name": "repo", "operator": "eq", "property_value": repoId} // name
                        ]
                    }),
                    new Keen.Query("count", {
                        eventCollection: "issues:edit",
                        filters: [
                            {"property_name": "user", "operator": "eq", "property_value": userId},
                            {"property_name": "repo", "operator": "eq", "property_value": repoId} // name
                        ]
                    }),
                    new Keen.Query("count", {
                        eventCollection: "issues:createComment",
                        filters: [
                            {"property_name": "user", "operator": "eq", "property_value": userId},
                            {"property_name": "repo", "operator": "eq", "property_value": repoId} // name
                        ]
                    })
                ];
            },
            c: 3
        },
        repo: {
            q: function (userId, repoId) {
                return [
                    new Keen.Query("count", {
                        eventCollection: "user:addRepo",
                        filters: [
                            {"property_name": "user", "operator": "eq", "property_value": userId},
                            {"property_name": "repo", "operator": "eq", "property_value": repoId}
                        ]
                    })
                ];
            },
            c: 1
        },
        merge: {
            q: function (userId, repo) {
                // TODO: merge with no issues
                return [];
            },
            c: 0
        }
    };

    karma.rankForUserAndRepo = function (userId, repo, fnResult) {
        var queries = [];
        // Only use queries that have modifiers
        for (var m in config.server.karma.modifiers) {
            if (modifierQueryMap[m]) {
                queries = queries.concat(modifierQueryMap[m].q(userId, repo));
            }
        }
        keenio.run(queries, function (err, res) {
            if (!err) {
                var power = 0;
                var j = 0;
                for (var modifier in modifierQueryMap) {
                    // is modifier enabled
                    if (config.server.karma.modifiers[modifier]) {
                        for (var i = 0; i < modifierQueryMap[modifier].c; i++) {
                            power += res[j].result * config.server.karma.modifiers[modifier];
                            j++;
                        }
                    }
                }
                fnResult(toRank(power));
            }
        });
    };

    return karma;
})();
