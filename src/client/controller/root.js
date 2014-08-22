// *****************************************************
// Root Controller
// *****************************************************

module.controller('RootCtrl', ['$rootScope', '$scope', '$stateParams', '$HUB', '$RPC', 
    function($rootScope, $scope, $stateParams, $HUB, $RPC) {

        $rootScope.user = $HUB.call('user', 'get', {});

        $scope.hook = true;

        $rootScope.$on('$stateChangeSuccess', function(event, toState, fromState, fromParams, error) {

            $scope.hook = true;

            if($stateParams.user && $stateParams.repo) {
                $RPC.call('repo', 'getHook', {
                    user: $stateParams.user,
                    repo: $stateParams.repo
                }, function(err, hook) {
                    if(!err) {
                        $scope.hook = hook.value;
                    }
                });
            }
        });

        $scope.createWebhook = function() {
            $RPC.call('repo', 'createHook', {
                user: $stateParams.user,
                repo: $stateParams.repo
            }, function(err, hook) {
                if(!err) {
                    $scope.hook = hook.value;
                    $scope.created = true;
                }
            });
        };

    }
]);
