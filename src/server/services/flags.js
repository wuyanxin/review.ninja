'use strict';

var reference = function(sha, path, position) {
    return sha + '/' + path + '#L' + position;
};

module.exports = {

    review: function(comments) {

        // input: all review comments
        // output: number of open/closed issues

        var threads = {};
        var openTotal = 0;
        var closedTotal = 0;
        var makeThreadRegex = /\!\bfix\b|\!\bresolve\b/g;
        var resolveThreadRegex = /\!\bfixed\b|\!\bresolved\b|\!\bcompleted\b/g;

        comments.forEach(function(comment) {
            var ref = reference(comment.original_commit_id, comment.path, comment.original_position);
            threads[ref] = threads[ref] || [];
            threads[ref].push(comment);
        });

        for (var ref in threads) {
            for (var i = threads[ref].length - 1; i >= 0; i--) {
                if (threads[ref][i].body.match(makeThreadRegex)) {
                    openTotal += 1;
                    break;
                }
                else if (threads[ref][i].body.match(resolveThreadRegex) && !threads[ref][i].body.match(makeThreadRegex)) {
                    closedTotal += 1;
                    break;
                }
            }
        }

        return {open: openTotal, closed: closedTotal};
    },

    conversation: function(comment) {

        // input: single conversation comment
        // output: true or false (true to create a ninja star)

        var starRegex = /\!star|\!ninjastar|\+1|\:thumbsup\:|\:star\:/g;
        return !!comment.body.match(starRegex);
    }

};
