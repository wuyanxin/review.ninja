'use strict';
// *****************************************************
// Root Controller
// *****************************************************

module.controller('RootCtrl', ['$rootScope', '$scope', '$stateParams', '$state', '$HUB', '$RPC',
    function($rootScope, $scope, $stateParams, $state, $HUB, $RPC) {

        $rootScope.user = $HUB.call('user', 'get', {});

        $scope.onboard = {};

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

        $scope.getOnboardingTasks = function() {
            $RPC.call('onboard', 'getactions', {
                user: $stateParams.user
            }, function(err, actions) {
                console.log('ayyylmao');
                if (!err && !(actions.value['onboard:dismiss'])) {
                    $scope.onboard = {
                        tasks: [
                            {text: 'Add repo', type: 'user:addRepo'},
                            {text: 'Review the code', type: 'pullRequests:get'},
                            {text: 'Open new issue', type: 'issues:add'},
                            {text: 'Close issue', type: 'issues:closed'},
                            {text: 'Give ninja star', type: 'star:add'},
                            {text: 'Merge code', type: 'pullRequests:merge'}
                        ],
                        dismiss: false};
                    $scope.onboard.tasks.forEach(function(t) {
                        t.done = actions.value[t.type];
                    });
                    $scope.onboard.tasksLoaded = true;
                }
            });
        };

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            $state.go('error');
        });

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

        $scope.displayTasks = function() {
            console.log($scope.onboard.tasks);
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
    }
]);
