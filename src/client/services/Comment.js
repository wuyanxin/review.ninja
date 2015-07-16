'use strict';

// *****************************************************
// Comment Factory
// *****************************************************

module.factory('Comment', ['Reference', function(Reference) {

    var thread = {};

    var status = function(comment) {

        var state, label;

        var negative = /\!\bfix\b|\!\bresolve\b/g;
        var positive = /\!\bfixed\b|\!\bresolved\b|\!\bcompleted\b/g;

        var negative = comment.body.match(negative);
        var positive = comment.body.match(positive);

        if(negative) {
            state = 'open';
            label = negative[0];
        } else if(positive && !negative) {
            state = 'closed';
            label = positive[0];
        }

        return {state: state, label: label};
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
                thread[sha][ref] = thread[sha][ref] || {state: 'none', label: 'none'};

                thread[sha][ref].comments = thread[sha][ref].comments || [];
                thread[sha][ref].comments.push(comment);

                var data = status(comment);
                thread[sha][ref].state = data.state || thread[sha][ref].state;
                thread[sha][ref].label = data.label || thread[sha][ref].label;
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
