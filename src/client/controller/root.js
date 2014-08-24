// *****************************************************
// Root Controller
// *****************************************************

module.controller('RootCtrl', ['$rootScope', '$scope', '$stateParams', '$HUB', '$RPC', 
    function($rootScope, $scope, $stateParams, $HUB, $RPC) {

        $rootScope.user = $HUB.call('user', 'get', {});

        $rootScope.$on('repos:get', function(event, repo) {
            $scope.repo = repo;
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, error) {

            if( !($stateParams.user && $stateParams.repo) ) {
                $scope.hook = {};
            }

            if($stateParams.user && $stateParams.repo && toParams.user!==fromParams.user) {
                $scope.hook = $RPC.call('repo', 'getHook', {
                    user: $stateParams.user,
                    repo: $stateParams.repo
                });
            }
        });

        $scope.createWebhook = function() {
            $scope.creating = $RPC.call('repo', 'createHook', {
                user: $stateParams.user,
                repo: $stateParams.repo
            }, function(err, hook) {
                if(!err) {
                    $scope.hook = hook;
                    $scope.created = true;
                }
            });
        };

    }
]);
