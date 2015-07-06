'use strict';

// *****************************************************
// Comment Factory
// *****************************************************

module.factory('Comment', ['Reference', function(Reference) {

    return {

        review: function(comment, thread) {

            var add = function(sha, path, position) {
                var ref = Reference.get(path, position);

                thread[sha] = thread[sha] || {};
                thread[sha][ref] = thread[sha][ref] || [];
                thread[sha][ref].push(comment);
            };

            if(comment.commit_id && comment.position) {
                add(comment.commit_id, comment.path, comment.position);
            }
            else if(comment.commit_id !== comment.original_commit_id) {
                add(comment.original_commit_id, comment.path, comment.original_position);
            }

            return comment;
        }
    };
}]);
