'use strict';
// *****************************************************
// Graph Directive
// *****************************************************

module.directive('onboard', ['$rootScope', '$stateParams', '$RPC', 'socket',
    function($rootScope, $stateParams, $RPC, socket) {
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
                                action.val = actions.value[action.key];
                            });
                        }
                    });
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
