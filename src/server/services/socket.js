'use strict';

module.exports = {
    emit: function(event, args) {

        var data = {action: args.action};
        var room = args.repository.owner.login + ':' + args.repository.name + ':' + event;

        var events = {
            // add review comments
            pull_request: function(done) {
                data.base = args.pull_request.base.sha;
                data.head = args.pull_request.head.sha;
                data.number = args.pull_request.number;
                done(room, data);
            },
            pull_request_review_comment: function(done) {
                data.id = args.comment.id;
                data.number = args.pull_request.number;
                done(room, data);
            },
            issue_comment: function(done) {
                data.id = args.comment.id;
                data.number = args.issue.number;
                done(room, data);
            },
            status: function(done) {
                data.sha = args.commit.sha;
                done(room, data);
            }
        };

        if(events[event]) {
            events[event](function(room, data) {
                io.emit(room, data);
            });
        }
    }
};
