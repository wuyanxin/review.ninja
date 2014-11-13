// *****************************************************
// Diff File Directive
// *****************************************************

module.directive('diff', ['$stateParams', '$state', '$HUB', '$RPC',
    function($stateParams, $state, $HUB, $RPC) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/diff.html',
            scope: {
                path: '=',
                patch: '=',
                status: '=',
                fileSha: '=',
                baseSha: '=',
                headSha: '=',
                selection: '=',
                issues: '='
            },
            link: function(scope, elem, attrs) {
                scope.file = null;
                scope.open = true;
                scope.expanded = false;
                scope.reference = {};

                //
                // todo: clean up this code
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

                                scope.file = file;
                            }

                        });
                    }

                });

                //
                // Watches
                //
                scope.$watch('issues', function() {
                    if(scope.issues) {
                        scope.reference = {};
                        scope.issues.forEach(function(issue) {
                            if(issue.key) {
                                scope.reference[issue.key] = true;
                            }
                        });
                        console.log(scope.reference);
                    }
                });

                scope.baseRef = function(line) {
                    return (scope.baseSha + '/' + scope.path + '#L' + line.base);
                };

                scope.headRef = function(line) {
                    return (scope.headSha + '/' + scope.path + '#L' + line.head);
                };

                scope.select = function(line) {
                    if(line.head) {
                        var ref = scope.headRef(line);
                        var cur = scope.selection[0] ? scope.selection[0].ref : null;

                        scope.selection.length = 0;

                        if(ref !== cur) {
                            scope.selection.push({
                                ref: ref,
                                line: scope.path + '#L' + line.head
                            });
                        }
                    }
                };

                scope.go = function(baseRefs, headRefs) {

                    var issues = [];

                    if(baseRefs) {
                        for(var i = 0; i < baseRefs.length; i++) {
                            issues.push(baseRefs[i].issue);
                        }
                    }

                    if(headRefs) {
                        for(var j = 0; j < headRefs.length; j++) {
                            issues.push(headRefs[j].issue);
                        }
                    }

                    if(issues.length === 1) {
                        return $state.go('repo.pull.issue.detail', { issue: issues[0] });
                    }

                    $state.go('repo.pull.issue.master', { issues: issues });
                };
            }
        };
    }
]);
