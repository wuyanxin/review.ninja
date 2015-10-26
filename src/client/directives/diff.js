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

                            var lines = {add: {}, del: {}, normal: {}};

                            scope.file.patch.forEach(function(line) {
                                lines[line.type] = lines[line.type] || {};
                                lines[line.type][line.head || line.base] = line;
                            });

                            var temp = {};
                            var prev = {base: 0};

                            scope.file.file = [];

                            blob.value.content.forEach(function(line) {

                                temp = lines.normal[line.head] || lines.add[line.head] || {
                                    type: 'disabled',
                                    head: line.head,
                                    base: prev.base + 1,
                                    content: line.content,
                                    disabled: true
                                };

                                for(var i = prev.base + 1; i < temp.base; i++) {
                                    scope.file.file.push(lines.del[i]);
                                }

                                prev = temp.base ? temp : prev;

                                scope.file.file.push(temp);
                            });
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
