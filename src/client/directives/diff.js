'use strict';

// *****************************************************
// Diff File Directive
// *****************************************************

module.directive('diff', ['$stateParams', '$state', '$HUB', '$RPC', 'Reference',
    function($stateParams, $state, $HUB, $RPC, Reference) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/diff.html',
            scope: {
                file: '=',
                thread: '='
            },
            link: function(scope, elem, attrs) {

                scope.expanded = false;

                scope.blob = null;

                scope.open = !scope.file.ignored;

                scope.anchor = Reference.anchor;

                scope.$stateParams = $stateParams;

                //
                // Helper funtions
                //

                scope.expand = function() {

                    scope.expanded = !scope.expanded;

                    scope.blob = scope.blob || $HUB.wrap('gitdata', 'getBlob', {
                        user: $stateParams.user,
                        repo: $stateParams.repo,
                        sha: scope.file.sha
                    }, function(err, blob) {
                        if(!err) {

                            var normal = {};
                            var additions = {};
                            var deletions = {};

                            scope.file.patch.forEach(function(line) {
                                if(line.type === 'normal') {
                                    normal[line.head] = line;
                                }
                                if(line.type === 'add') {
                                    additions[line.head] = line;
                                }
                                if(line.type === 'del') {
                                    deletions[line.base] = line;
                                }
                            });

                            var max = 0;
                            var _line = null;
                            var temp = {};
                            scope.file.file = [];

                            blob.value.content.forEach(function(line) {

                                _line = normal[line.head] || additions[line.head] || {
                                    type: 'disabled',
                                    head: line.head,
                                    base: _line ? _line.base + 1 : null,
                                    content: line.content,
                                    disabled: true
                                };

                                max = line.head + 1;
                                temp[line.head] = _line;
                            });

                            for(var i = 1; i < max; i++) {

                                var j = i;

                                while(deletions[j]) {
                                    scope.file.file.push(deletions[j]);
                                    delete deletions[j++];
                                }

                                scope.file.file.push(temp[i]);
                            }
                        }
                    });
                };

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
