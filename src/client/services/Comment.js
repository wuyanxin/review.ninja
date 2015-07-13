'use strict';

// *****************************************************
// Comment Factory
// *****************************************************

module.factory('Comment', ['Reference', function(Reference) {

    var thread = {};

    return {

        thread: function(comments) {
            thread = comments.thread = comments.thread || {};
            return comments;
        },

        status: function(ref) {

            var status = 'closed';

            var negative = /\!\bfix\b|\!\bresolve\b/g;
            var positive = /\!\bfixed\b|\!\bresolved\b|\!\bcompleted\b/g;

            ref.comments.forEach(function(comment) {
                if(comment.body.match(negative)) {
                    status = 'open';
                }
                else if(comment.body.match(positive) && !comment.body.match(negative)) {
                    status = 'closed';
                }
            });

            return status;
        },

        review: function(comment) {

            var add = function(sha, path, position) {
                console.log('this thread is', thread);
                var ref = Reference.get(path, position);

                thread[sha] = thread[sha] || {};
                thread[sha][ref] = thread[sha][ref] || {};
                thread[sha][ref].comments = thread[sha][ref].comments || [];
                thread[sha][ref].comments.push(comment);
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
