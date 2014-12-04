// *****************************************************
// Merge Directive
// *****************************************************

module.directive('mergeButton', ['$HUB', function($HUB) {
    return {
        restrict: 'E',
        templateUrl: '/directives/templates/merge.html',
        scope: {
            pull: '=',
            status: '=',
            user: '=',
            repo: '=',
            ref: '=',
            number: '=',
            getPullRequest: '&'
        },
        link: function(scope, elem, attrs) {

            var text = {
                failure: 'failed',
                pending: 'pending',
                success: 'succeeded'
            };

            $HUB.call('gitdata', 'getReference', {
                user: scope.user,
                repo: scope.repo,
                ref: scope.ref
            }, function(err, ref) {
                if(!err) {
                    scope.branch = true;
                }
            });

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

            scope.deleteBranch = function() {
                $HUB.call('gitdata', 'deleteReference', {
                    user: scope.user,
                    repo: scope.repo,
                    ref: scope.ref
                }, function(err, result) {
                    if(!err) {
                        scope.getPullRequest();
                        scope.branch = false;
                    }
                });
            };

            scope.merge = function() {
                $HUB.call('pullRequests', 'merge', {
                    user: scope.user,
                    repo: scope.repo,
                    number: scope.number
                }, function(err, pull) {

                    // todo: handle error or unmerged

                    if(!err && pull.value.merged) {
                        scope.pull.merged = true;
                        scope.getPullRequest();
                    }
                });
            };
        }
    };
}]);
