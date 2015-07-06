'use strict';
// *****************************************************
// Graph Directive
// *****************************************************

module.directive('graph', ['$state', '$stateParams', function($state, $stateParams) {
    return {
        restrict: 'E',
        templateUrl: '/directives/templates/graph.html',
        scope: {
            baseSha: '=',
            headSha: '='
        },
        link: function(scope, elem, attrs) {
            scope.$state = $state;
            scope.$stateParams = $stateParams;
        }
    };
}]);
