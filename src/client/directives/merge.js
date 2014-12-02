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
            delete: '&',
            merging: '='
        },
        link: function(scope, elem, attrs) {

            var text = {
                failure: 'failed',
                pending: 'pending',
                success: 'succeeded'
            };

            scope.deleted = false;

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

            scope.getReference = function() {
                $HUB.call('gitdata', 'getReference', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    ref: 'heads/' + $scope.pull.head.ref
                }, function(err, result) {
                    if(!err) {
                        scope.deleted = true;
                    }
                });
            };
        }
    };
});
