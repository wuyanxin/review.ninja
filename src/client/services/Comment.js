'use strict';

// *****************************************************
// Comment Factory
// *****************************************************

module.factory('Comment', ['Reference', function(Reference) {

    var thread = {};

    var status = function(comment) {

        var status;

        var negative = /\!\bfix\b|\!\bresolve\b/g;
        var positive = /\!\bfixed\b|\!\bresolved\b|\!\bcompleted\b/g;

        if(comment.body.match(negative)) {
            status = 'open';
        }
        else if(comment.body.match(positive) && !comment.body.match(negative)) {
            status = 'closed';
        }

        return status;
    };

    return {

        thread: function(comments) {
            thread = comments.thread = comments.thread || {};
            return comments;
        },

        review: function(comment) {

            var add = function(sha, path, position) {
                var ref = Reference.get(path, position);

                thread[sha] = thread[sha] || {};
                thread[sha][ref] = thread[sha][ref] || {status: 'none'};
                thread[sha][ref].comments = thread[sha][ref].comments || [];
                thread[sha][ref].comments.push(comment);
                thread[sha][ref].status = status(comment) || thread[sha][ref].status;
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
