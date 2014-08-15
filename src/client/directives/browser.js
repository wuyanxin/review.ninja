// *****************************************************
// File Browser Directive
// *****************************************************

module.directive('browser', ['$stateParams', '$HUB', '$RPC',
    function($stateParams, $HUB, $RPC) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/browser.html',
            scope: {
                tree: '='
            },
            link: function(scope, elem, attrs) {

                scope.stack=[], scope.path=[];

                scope.up = function() {

                    var tree = scope.stack.pop();

                    if(tree) {
                        $HUB.call('gitdata', 'getTree', {
                            user: $stateParams.user,
                            repo: $stateParams.repo,
                            sha: tree.sha,
                        }, function(err, res) {
                            if(!err) {
                                scope.file = null;
                                scope.tree = res.value;
                            }
                        });
                    }
                };

                scope.down = function(node) {

                    if(node.type == 'tree') {

                        $HUB.call('gitdata', 'getTree', {
                            user: $stateParams.user,
                            repo: $stateParams.repo,
                            sha: node.sha,
                        }, function(err, res) {
                            if(!err) {
                                scope.path.push(node.path);
                                scope.stack.push(scope.tree);
                                scope.tree = res.value;
                            }
                        });
                    } 
                    else if(node.type == 'blob') {

                        $RPC.call('comm', 'file', {
                            user: $stateParams.user,
                            repo: $stateParams.repo,
                            sha: node.sha
                        }, function(err, res) {
                            if(!err) {
                                scope.path.push(node.path);
                                scope.stack.push(scope.tree);
                                scope.file = res.value;
                            }
                        });
                    }
                };
            }
        };
    }
]);
