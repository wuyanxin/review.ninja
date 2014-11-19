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

            scope.$watch('status', function(status) {
                var state = status ? status.state : null;
                if(state) {
                    scope.status.count = 0;
                    scope.status.text = text[state];
                    scope.status.statuses.forEach(function(status) {
                        if(status.state === state) {
                            scope.status.count++;
                        }
                    });
                }

                // the default status
                scope.status = scope.status || {
                    state: 'pending',
                    statuses: []
                };
            });
        }
    };
});
