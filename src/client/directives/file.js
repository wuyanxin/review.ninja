// *****************************************************
// File Directive
// *****************************************************

module.directive('file', ['$stateParams', '$HUB', '$RPC',
    function($stateParams, $HUB, $RPC) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/file.html',
            scope: {
                path: '=',
                content: '=',
                comments: '=',
                onComment: '&comment'
            },
            link: function(scope, elem, attrs) {

                scope.$watch('content', function(newVal, oldVal) {
                    if (newVal) {
                        scope.lines = scope.content.trim().replace(/\t/g, '    ').split('\n');
                    }
                });
            }
        };
    }
]);
