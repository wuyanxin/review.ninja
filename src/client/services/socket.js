// *****************************************************
// Socket Factory
// *****************************************************
// Example usage:
//
// listen to event:
//
// socket.on('event-name', function(data) {
//   reaction to event
// };
//
// emit event:
//
// socket.emit('event-name', data);
//
module.factory('socket', ['$rootScope', '$RPC', function($rootScope, $RPC) {

    var socket = io.connect();

    return {
        on: function(eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        },
        join: function(user, repo) {
            $RPC.call('socket', 'join', {
                id: socket.io.engine.id,
                user: user,
                repo: repo
            });
        }
    };
}]);
