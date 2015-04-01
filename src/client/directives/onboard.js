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

                scope.completed = scope.actions.filter(function(a) { return a.val === true; }).length;

                scope.dismiss = function(todismiss) {
                    $RPC.call('user', 'dismiss', { dismiss: todismiss }, function(err, res) {
                        if(!err) {
                            console.log(res);
                        }
                    });
                };

                var getActions = function() {
                    $RPC.call('onboard', 'getactions', {
                        user: $stateParams.user,
                        repo: $stateParams.repo
                    }, function(err, actions) {
                        if(!err) {
                            scope.actions.forEach(function(action) {
                                if (action.val !== actions.value[action.key]) {
                                    action.val = actions.value[action.key];
                                    scope.completed += 1;
                                    if (scope.completed === 6) {
                                        scope.fadeOutTasks();
                                    }
                                }
                            });
                        }
                    });
                };

                scope.fadeOutTasks = function() {
                    scope.startFadeout = true;
                    $timeout(function() {
                        scope.tasksHidden = true;
                        scope.fadeInMessage();
                    }, 1000);
                };

                scope.fadeInMessage = function() {
                    scope.messageShow = true;
                    scope.startFadein = true;
                    console.log('fadein started');
                    $timeout(function() {
                        scope.killClass = true;
                        scope.dismiss('taskbar');
                    }, 50);
                };

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
