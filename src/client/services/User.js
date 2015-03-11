'use strict';
// *****************************************************
// User Factory
// *****************************************************

module.factory('User', ['$HUB', '$RPC', '$stateParams', '$rootScope', function($HUB, $RPC, $stateParams, $rootScope) {
    return {
        ghost: function(user, done) {
            if(!user) {
                $HUB.call('user', 'getFrom', {
                    user: 'ghost'
                }, function(err, ghost) {
                    if(!err) {
                        return done(ghost.value);
                    }
                    done(null);
                });
            }
        }
    };
}]);
