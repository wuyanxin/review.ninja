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
        var makeThreadRegex = /\!fix|\!resolve/g;
        var resolveThreadRegex = /\!fixed|\!resolved\!completed/g;

        comments.forEach(function(comment) {
            var ref = reference(comment.commit_id, comment.path, comment.position);
            threads[ref] = threads[ref] || [];
            threads[ref].push(comment);
        });

        for (var ref in threads) {
            if (threads.hasOwnProperty(ref)) {
                var i = threads[ref].length - 1;
                var matched = false;
                while (!matched || i !== -1) {
                    if (threads[ref][i].body.match(makeThreadRegex)) {
                        openTotal += 1;
                        matched = true;
                    }
                    else if (threads[ref][i].body.match(resolveThreadRegex) && !threads[ref][i].body.match(makeThreadRegex)) {
                        closedTotal += 1;
                        matched = true;
                    }
                    else {
                        i -= 1;
                    }
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
