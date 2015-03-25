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
                        console.log(types);
                        $scope.tasks = [];
                        var actionText = [
                            'Add repo',
                            'Review the code',
                            'Open new issue',
                            'Close issue',
                            'Give ninja star',
                            'Merge code'
                        ];
                        for (var i = 0; i < actionText.length; i++) {
                            console.log(actionText);
                            $scope.tasks.push({text: actionText[i], done: types[i]});
                        }
                        return $scope.tasks;
                    }
                });
            }
        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            $state.go('error');
        });

        $scope.checkSteps = function() {
            $RPC.call('onboard', 'getactions', {
                user: $rootScope.user.value,
            }, function(err, types) {
                console.log($rootScope.user.value.id);
                if (!err) {
                    console.log(types);
                    $scope.tasks = [];
                    var actionText = [
                        'Add repo',
                        'Review the code',
                        'Open new issue',
                        'Close issue',
                        'Give ninja star',
                        'Merge code'
                    ];
                    for (var i = 0; i < actionText.length; i++) {
                        console.log(actionText);
                        $scope.tasks.push({text: actionText[i], done: types[i]});
                    }
                }
            });
        }

        $scope.displayTasks = function() {
            console.log($scope.tasks);
        }

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
