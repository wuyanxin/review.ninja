// *****************************************************
// File Directive
// *****************************************************

module.directive('mergeButton', ['$rootScope', function($rootScope) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/merge.html',
            scope: {
                stars: '=',
                merge: '&',
                merged: '=',
                mergeable: '='
            },
            link: function(scope, elem, attrs) {

                $rootScope.$watch('open', function() {
                    scope.open = $rootScope.open;
                });

                $rootScope.$watch('closed', function() {
                    scope.closed = $rootScope.closed;
                });
            }
        };
    }
]);
