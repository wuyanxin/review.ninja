// *****************************************************
// Root Controller
// *****************************************************

module.controller('RootCtrl', ['$rootScope', '$scope', '$stateParams', '$HUB', '$RPC', 'socket',
    function($rootScope, $scope, $stateParams, $HUB, $RPC, socket) {

        $rootScope.user = $HUB.call('user', 'get', {});

        $rootScope.$on('repos:get', function(event, repo) {
            $scope.repo = repo;
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, error) {

            if( !($stateParams.user && $stateParams.repo) ) {
                $scope.hook = {};
            }

            if( $stateParams.user && $stateParams.repo &&
                $scope.repo && $scope.repo.permissions.admin &&
                toParams.user !== fromParams.user ) {

                $scope.hook = $RPC.call('webhook', 'get', {
                    user: $stateParams.user,
                    repo: $stateParams.repo
                });
            }

            // change the websocket room
            if( $stateParams.user && $stateParams.repo &&
                (toParams.user!==fromParams.user || toParams.repo!==fromParams.repo) ) {

                socket.emit('join', $stateParams.user + '/' + $stateParams.repo);
            }
        });

        $scope.createWebhook = function() {
            $scope.creating = $RPC.call('webhook', 'create', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                user_uuid: $rootScope.user.value.id
            }, function(err, hook) {
                if(!err) {
                    $scope.hook = hook;
                    $scope.created = true;
                }
            });
        };
    }
]);
