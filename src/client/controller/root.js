'use strict';
// *****************************************************
// Root Controller
// *****************************************************

module.controller('RootCtrl', ['$rootScope', '$scope', '$stateParams', '$state', '$HUB', '$RPC',
    function($rootScope, $scope, $stateParams, $state, $HUB, $RPC) {

        $rootScope.user = $HUB.call('user', 'get', {});

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, error) {

            if(!($stateParams.user && $stateParams.repo)) {
                $scope.hook = {};
                return;
            }

            if(toParams.user !== fromParams.user || toParams.repo !== fromParams.repo) {
                $HUB.call('repos', 'get', {
                    user: $stateParams.user,
                    repo: $stateParams.repo
                }, function(err, repo) {
                    if(!err && repo.value.permissions.admin) {
                        $scope.hook = $RPC.call('webhook', 'get', {
                            user: $stateParams.user,
                            repo: $stateParams.repo
                        });
                    }
                });
                $RPC.call('onboard', 'getactions', {
                    user: $stateParams.user,
                }, function(err, types) {
                    if (!err) {
                        $scope.tasks = [
                            'Add repo',
                            'Review the code',
                            'Open and close new issue',
                            'Give ninja star',
                            'Merge code'
                        ];

                        types.forEach(function(val) {

                        });
                        $scope.actionsTaken = types;
                        $scope.actionsToTake
                    }
                });
            }
        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            $state.go('error');
        });

        // $scope.checkSteps = function() {
        //     $scope.actions = $RPC.call('onboard', 'getactions', {
        //         user: $stateParams.user,
        //     });
        // }

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
