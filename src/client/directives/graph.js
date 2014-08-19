// *****************************************************
// Graph Directive
// *****************************************************

module.directive('graph', function() {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/graph.html',
            scope: {
                issue: '=',
                baseSha: '=',
                headSha: '=',
                activeSha: '=',
                compare: '&'
            }
        };
    }
);
