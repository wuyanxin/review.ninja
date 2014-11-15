// *****************************************************
// Diff File Directive
// *****************************************************

module.directive('diff', ['$stateParams', '$state', '$HUB', '$RPC', 'Reference', '$filter',
    function($stateParams, $state, $HUB, $RPC, Reference, $filter) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/diff.html',
            scope: {
                path: '=',
                patch: '=',
                status: '=',
                issues: '=',
                number: '=',
                fileSha: '=',
                baseSha: '=',
                headSha: '=',
                selection: '=',
                refIssues: '='
            },
            link: function(scope, elem, attrs) {
                scope.file = null;
                scope.open = true;
                scope.expanded = false;

                //
                // Expand the diff
                //

                scope.$watch('patch', function() {
                    if(scope.patch && scope.patch.length) {
                        $HUB.wrap('gitdata', 'getBlob', {
                            user: $stateParams.user,
                            repo: $stateParams.repo,
                            sha: scope.fileSha
                        }, function(err, res) {
                            if(!err) {

                                var file = [], chunks = [];
                                var index = 0;

                                // find the chunks
                                while (index < scope.patch.length) {
                                    if(scope.patch[index].chunk) {
                                        var start = 0, end = 0, c = [];
                                        while( ++index < scope.patch.length && !scope.patch[index].chunk ) {
                                            start = start ? start : scope.patch[index].head;
                                            end = scope.patch[index].head ? scope.patch[index].head : end;
                                            c.push(scope.patch[index]);
                                        }

                                        chunks.push({ start:start, end:end, chunk:c });
                                        continue;
                                    }
                                    index = index + 1;
                                }

                                index = 0;

                                // insert the chunks
                                while (index < res.value.content.length) {
                                    if( chunks[0] && res.value.content[index].head === chunks[0].start ) {
                                        chunk = chunks.shift();
                                        file = file.concat( chunk.chunk );
                                        index = chunk.end;
                                        continue;
                                    }

                                    file.push( res.value.content[index] );
                                    index = index + 1;
                                }

                                // set the file
                                scope.file = file;
                            }

                        });
                    }

                });

                //
                // Actions
                //

                scope.clear = function() {
                    scope.selection = {};
                };

                scope.selStarts = function(line) {
                    return Reference.starts(scope.headSha, scope.path, line.head, scope.selection.ref);
                };

                scope.isSelected = function(line) {
                    return Reference.includes(scope.headSha, scope.path, line.head, scope.selection.ref);
                };

                scope.refStarts = function(line) {
                    var match = false;
                    if(scope.issues) {
                        $filter('filter')(scope.issues, {number: scope.number}).forEach(function(issue) {
                            match = match || Reference.starts(scope.baseSha, scope.path, line.head, issue.key) || Reference.starts(scope.headSha, scope.path, line.head, issue.key);
                        });
                    }
                    return match;
                };

                scope.isReferenced = function(line) {
                    var match = false;
                    if(scope.issues) {
                        $filter('filter')(scope.issues, {number: scope.number}).forEach(function(issue) {
                            match = match || Reference.includes(scope.baseSha, scope.path, line.head, issue.key) || Reference.includes(scope.headSha, scope.path, line.head, issue.key);
                        });
                    }
                    return match;
                };

                scope.select = function(line, event) {
                    if(line.head) {
                        var shift = scope.selection.start && event.shiftKey && scope.path === scope.selection.path;
                        var start = !shift ? line.head : scope.selection.start;
                        var end = shift ? line.head : null;
                        scope.selection = Reference.select(scope.headSha, scope.path, start, end);
                    }
                };

                scope.go = function(line) {
                    var issues = [];

                    scope.issues.forEach(function(issue) {
                        if(Reference.starts(scope.baseSha, scope.path, line.head, issue.key) || Reference.starts(scope.headSha, scope.path, line.head, issue.key)) {
                            issues.push(issue.number);
                        }
                    });

                    if(issues.length === 1) {
                        return $state.go('repo.pull.issue.detail', { issue: issues[0] });
                    }

                    scope.refIssues = issues;
                };
            }
        };
    }
]);
