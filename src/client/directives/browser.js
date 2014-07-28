// *****************************************************
// File Browser Directive
// *****************************************************

module.directive('browser', ['$stateParams', '$HUB', '$RPC',
    function($stateParams, $HUB, $RPC) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/browser.html',
            scope: {
                data: '=',
                comment: '&',
                comments: '='
            },
            link: function(scope, elem, attrs) {

                scope.stack = [];

                scope.path = [];

                scope.$watch('data.value', function(newVal, oldVal) {

                    if (newVal) {
                        scope.tree = scope.data.value;
                    }
                });

                scope.up = function() {

                    scope.file = null;

                    scope.path.pop();

                    var tree = scope.stack.pop();

                    if (tree) {
                        scope.data = $HUB.call('gitdata', 'getTree', {
                            user: $stateParams.user,
                            repo: $stateParams.repo,
                            sha: tree.sha,
                        });
                    }
                };

                scope.down = function(node) {

                    scope.path.push(node.path);

                    scope.stack.push(scope.tree);

                    if (node.type == 'tree') {

                        scope.data = $HUB.call('gitdata', 'getTree', {
                            user: $stateParams.user,
                            repo: $stateParams.repo,
                            sha: node.sha,
                        });
                    } else if (node.type == 'blob') {

                        scope.file = $RPC.call('comm', 'file', {
                            user: $stateParams.user,
                            repo: $stateParams.repo,
                            sha: node.sha
                        });
                    }
                };
            }
        };
    }
]);
