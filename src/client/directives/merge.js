// *****************************************************
// File Directive
// *****************************************************

module.directive('mergeButton', function() {
    return {
        restrict: 'E',
        templateUrl: '/directives/templates/merge.html',
        scope: {
            pull: '=',
            merge: '&',
            status: '=',
            merging: '='
        },
        link: function(scope, elem, attrs) {

            var text = {
                failure: 'failed',
                pending: 'pending',
                success: 'succeeded'
            };

            scope.$watch('status.state', function(state) {
                if(state) {
                    scope.status.count = 0;
                    scope.status.text = text[state];
                    scope.status.statuses.forEach(function(status) {
                        if(status.state === state) {
                            scope.status.count++;
                        }
                    });
                }
            });
        }
    };
});
