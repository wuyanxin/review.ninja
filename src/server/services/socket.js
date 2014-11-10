module.exports = {
    emit: function(event, args) {

        var data = {action: args.action};
        var room = args.repository.owner.login + ':' + args.repository.name + ':' + event;

        var events = {
            issues: function() {
                data.number = args.issue.number;
            },
            pull_request: function() {
                data.number = args.pull_request.number;
            },
            issue_comment: function() {
                data.id = args.comment.id;
                room = room + ':' + args.issue.number;
            }
        };

        if(events[event]) {
            events[event]();
        }

        io.emit(room, data);
    }
};
