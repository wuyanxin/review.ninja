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
            headSha: '=',
            thread: '='
        },
        link: function(scope, elem, attrs) {
            scope.$state = $state;
            scope.$stateParams = $stateParams;

            //
            // Watches
            //

            scope.$watch('thread', function(thread) {

                scope.open = false;

                if(thread) {
                    angular.forEach(thread, function(ref) {
                        if(ref.status === 'open') {
                            scope.open = true;
                        }
                    });
                }
            });
        }
    };
}]);
