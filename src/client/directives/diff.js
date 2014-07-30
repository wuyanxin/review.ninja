// *****************************************************
// Diff File Directive
// *****************************************************

module.directive('diff', ['$stateParams', '$HUB', '$RPC',
    function($stateParams, $HUB, $RPC) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/diff.html',
            scope: {
                path: '=',
                lines: '=',
                comments: '=',
                onComment: '&comment'
            },
            link: function(scope, elem, attrs) {

                // 
                // actions
                //

                scope.selected = {};

                scope.add = function(index) {
                    scope.selected[index] = !scope.selected[index];
                };

                console.log( scope.lines );
            }
        };
    }
]);
