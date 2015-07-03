'use strict';

// *****************************************************
// Comment Factory
// *****************************************************

module.factory('Comment', function() {

    var reference = function(sha, path, position) {
        return sha + '/' + path + '#L' + position;
    };

    return {
        review: function(comments) {

            comments.thread = comments.thread || {};

            comments.affix.forEach(function(comment) {
                var ref = reference(comment.commit_id, comment.path, comment.position);

                comments.thread[ref] = comments.thread[ref] || [];
                comments.thread[ref].push(comment);
            });

            return comments;
        }
    };
});
