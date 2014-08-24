// *****************************************************
// Graph Directive
// *****************************************************

module.directive('graph', ['Reference', function(Reference) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/graph.html',
            scope: {
                baseSha: '=',
                headSha: '=',
                activeSha: '=',
                compare: '&'
            },
            link: function(scope, elem, attrs) {
                scope.issue = Reference.active;
            }
        };
    }
]);
