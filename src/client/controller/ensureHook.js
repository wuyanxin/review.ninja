
// *****************************************************
// Hook Ensurance Controller
//
// tmpl: inline
// path: always with the navbar
// *****************************************************

module.controller('EnsureHookCtrl', ['$rootScope', '$scope', '$stateParams', '$HUB', '$RPC',
    function($rootScope, $scope, $stateParams, $HUB, $RPC) {
        $scope.hookExists = true;
        $rootScope.$on('$stateChangeSuccess', function(event, toState, fromState, fromParams, error) {
            if($stateParams.user && $stateParams.repo) {
                $RPC.call('repo', 'hookExists', {
                    user: $stateParams.user,
                    repo: $stateParams.repo
                }, function(err, result) {
                    $scope.hookExists = result.value.hookExists;
                });
            }
            if(!$stateParams.user && !$stateParams.repo) {
                $scope.hookExists = true;
            }
        });

        $scope.createWebhook = function() {
            $RPC.call('repo', 'createHook', {
                user: $stateParams.user,
                repo: $stateParams.repo
            }, function(err, result) {
                if(!err) {
                    $scope.hookExists = true;
                    $scope.hookCreated = true;
                }
            });
        };
    }
]);
