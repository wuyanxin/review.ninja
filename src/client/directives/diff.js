'use strict';

// *****************************************************
// Diff File Directive
// *****************************************************

module.directive('diff', ['$stateParams', '$state', '$HUB', '$RPC', 'Reference', '$filter',
    function($stateParams, $state, $HUB, $RPC, Reference, $filter) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/diff.html',
            scope: {
                file: '=',
                thread: '='
            },
            link: function(scope, elem, attrs) {

                scope.expanded = false;

                scope.open = !scope.file.ignored;

                //
                // Helper funtions
                //

                scope.referenced = function(path, position) {
                    return scope.thread && scope.thread[Reference.get($stateParams.head, path, position)];
                };

                scope.selected = function(path, position) {
                    return $stateParams.ref === Reference.get($stateParams.head, path, position);
                };

                scope.go = function(path, position) {
                    if(position) {
                        $state.go('repo.pull.review.reviewItem', {
                            head: $stateParams.head,
                            ref: Reference.get($stateParams.head, path, position)
                        });
                    }
                };

            }
        };
    }
]);
