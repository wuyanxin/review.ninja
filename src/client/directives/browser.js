// *****************************************************
// File Browser Directive
// *****************************************************

module.directive('browser', ['$stateParams', '$HUB', '$RPC',
    function($stateParams, $HUB, $RPC) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/browser.html',
            scope: {
                tree: '=',
                headSha: '=',
                number: '=',
                issues: '=',
                selection: '=',
                refIssues: '='
            },
            link: function(scope, elem, attrs) {

                scope.stack = [];
                scope.path = [];
                scope.maxfilesize = 10000;

                scope.up = function() {

                    if(scope.stack.length) {
                        scope.file = null;
                        scope.path.pop();
                        scope.tree = scope.stack.pop();
                    }
                };

                scope.down = function(node) {
                    if(node.type === 'tree') {
                        $HUB.call('gitdata', 'getTree', {
                            user: $stateParams.user,
                            repo: $stateParams.repo,
                            sha: node.sha
                        }, function(err, res) {
                            if(!err) {
                                console.log('res tree', res);
                                scope.path.push(node.path);
                                scope.stack.push(scope.tree);
                                scope.tree = res.value;
                            }
                        });
                    } else if(node.type === 'blob') {
                        $HUB.wrap('gitdata', 'getBlob', {
                            user: $stateParams.user,
                            repo: $stateParams.repo,
                            sha: node.sha
                        }, function(err, res) {
                            if(!err) {
                                console.log('res blob', res);
                                scope.path.push(node.path);
                                scope.stack.push(scope.tree);
                                scope.file = res.value;
                            }
                        });
                    }
                };

                scope.islink = function(node) {
                    return !node.size || node.size < scope.maxfilesize;
                }
            }
        };
    }
]);
