'use strict';

var reference = function(sha, path, position) {
    return sha + '/' + path + '#L' + position;
};

module.exports = {

    review: function(comments) {

        // input: all review comments
        // output: number of open/closed issues
        
        var threads = {};
        
        comments.forEach(function(comment) {
            var ref = reference(comment.commit_id, comment.path, comment.position);
            
            threads[ref] = threads[ref] || [];
            threads[ref].push(comment);
        });

        return {open: 0, closed: 0};
    },

    conversation: function(comment) {

        // input: single conversation comment
        // output: true or false (true to create a ninja star)

        return false;
    }

};
