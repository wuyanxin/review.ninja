'use strict';
// *****************************************************
// Graph Directive
// *****************************************************

module.directive('onboard', ['$rootScope', '$stateParams', '$RPC', '$timeout', 'socket',
    function($rootScope, $stateParams, $RPC, $timeout, socket) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/onboard.html',
            link: function(scope, elem, attrs) {
                scope.actions = [
                    {key: 'user:addRepo', text: 'Add repo'},
                    {key: 'pullRequests:get', text: 'View pull request'},
                    {key: 'issues:add', text: 'Create issue'},
                    {key: 'issues:closed', text: 'Close issue'},
                    {key: 'star:add', text: 'Star pull request'},
                    {key: 'pullRequests:merge', text: 'Merge code'}
                ];

                var getActions = function() {
                    $RPC.call('onboard', 'getactions', {
                        user: $stateParams.user,
                        repo: $stateParams.repo
                    }, function(err, actions) {
                        if(!err) {
                            var completed = 0;
                            scope.actions.forEach(function(action) {
                                action.val = actions.value[action.key];
                                if (actions.value[action.key]) {
                                    completed = completed + 1;
                                }
                            });
                            scope.completed = (scope.actions.length === completed);
                        }
                    });
                };

                // scope.fadeOutTasks = function() {
                //     scope.startFadeout = true;
                //     $timeout(function() {
                //         scope.tasksHidden = true;
                //         scope.fadeInMessage();
                //     }, 1000);
                // };

                // scope.fadeInMessage = function() {
                //     scope.messageShow = true;
                //     scope.startFadein = true;
                //     console.log('fadein started');
                //     $timeout(function() {
                //         scope.killHiddenDefault = true;
                //         $rootScope.dismiss('taskbar');
                //     }, 50);
                // };

                getActions();

                $rootScope.promise.then(function(user) {
                    socket.on('action:' + user.value.id, function() { 
                        getActions();
                    });
                });
            }
        };
    }
]);
