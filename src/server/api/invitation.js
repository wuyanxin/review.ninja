var notification = require('../services/notification');

module.exports = {
    invite: function(req, done) {
        notification.invite(req.args.user, req.args.repo, req.args.invitee, req.user.id, req.user.token);
    }
};
