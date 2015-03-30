'use strict';
// *****************************************************
// Root Controller
// *****************************************************

module.controller('RootCtrl', ['$rootScope', '$scope', '$stateParams', '$state', '$HUB', '$RPC',
    function($rootScope, $scope, $stateParams, $state, $HUB, $RPC) {

        $rootScope.user = $HUB.call('user', 'get', {});

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, error) {

            if(!($stateParams.user && $stateParams.repo)) {
                $scope.onboard = {};
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
                $scope.getOnboardingTasks();
            }
        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            $state.go('error');
        });

        $scope.getOnboardingTasks = function() {
            $scope.actions = $RPC.call('onboard', 'getactions', {
                user: $stateParams.user,
                repo: $stateParams.repo
            });
        };

        $scope.dismissOnboard = function() {
            // api call to dismiss onboarding forever
            $RPC.call('onboard', 'dismiss', {
                user: $stateParams.user
            }, function(err, res) {
                if (!err) {
                    $scope.onboard.dismiss = true;
                }
            });
        };

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

        socket.on('action:' + $rootScope.user.id, function() {
            $scope.getOnboardingTasks();
        });
    }
]);
