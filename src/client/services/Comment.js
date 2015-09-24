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

        negative = comment.body.match(negative);
        positive = comment.body.match(positive);

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

                var ref = Reference.get(sha, path, position);

                thread[ref] = thread[ref] || {
                    sha: sha,
                    file: path.split('/').pop(),
                    body: comment.body,
                    author: comment.user.login,
                    avatar: comment.user.avatar_url,
                    state: 'none',
                    label: 'Add status',
                    anchor: Reference.anchor(sha, path, position),
                    comments: []
                };

                thread[ref].comments.push(comment);
                thread[ref].last_updated = comment.created_at;

                var data = status(comment);
                thread[ref].state = data.state || thread[ref].state;
                thread[ref].label = data.label || thread[ref].label;
            };

            if(comment.commit_id && comment.position) {
                add(comment.commit_id, comment.path, comment.position);
            } else {
                add(comment.original_commit_id, comment.path, comment.original_position);
            }

            return comment;
        }
    };
}]);
