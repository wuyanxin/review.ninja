'use strict';
// *****************************************************
// Graph Directive
// *****************************************************

module.directive('graph', ['$state', '$stateParams', 'Reference', function($state, $stateParams, Reference) {
    return {
        restrict: 'E',
        templateUrl: '/directives/templates/graph.html',
        scope: {
            baseSha: '=',
            headSha: '=',
            thread: '='
        },
        link: function(scope, elem, attrs) {
            scope.$state = $state;
            scope.$stateParams = $stateParams;
            scope.parse = Reference.parse;
        }
    };
}]);
