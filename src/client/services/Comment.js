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

            comments.transpose = comments.transpose || {};

            comments.affix.forEach(function(comment) {

                var ref = reference(comment.commit_id, comment.path, comment.position);

                comments.transpose[ref] = comments.transpose[ref] || [];

                comments.transpose[ref].push(comment);

            });

            return comments;
        }
    };
});
