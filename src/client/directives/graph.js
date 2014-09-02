// *****************************************************
// Graph Directive
// *****************************************************

module.directive('graph', function() {
    return {
        restrict: 'E',
        templateUrl: '/directives/templates/graph.html',
        scope: {
            baseSha: '=',
            headSha: '=',
            issueSha: '=',
            issueNum: '=',
            activeSha: '=',
            compare: '&'
        }
    };
});
