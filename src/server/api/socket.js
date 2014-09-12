var github = require('../services/github');

module.exports = {

    join: function(req, done) {

        io.sockets.forEach(function(socket) {

            if(req.args.id === socket.id) {

                // can only be in one room at a time
                socket.rooms.forEach(function(room) {
                    socket.leave(room);
                });

                // check if user has access to repo
                github.call({
                    obj: 'repos',
                    fun: 'get',
                    arg: {
                        user: req.args.user,
                        repo: req.args.repo
                    },
                    token: req.user.token
                }, function(err, repo) {
                    if(repo) {
                        socket.join(req.args.user + '/' + req.args.repo);
                    }
                });
            }
        });

        done();
    }
};
