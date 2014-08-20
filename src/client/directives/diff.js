// *****************************************************
// Diff File Directive
// *****************************************************

module.directive('diff', ['$stateParams', '$state', '$HUB', '$RPC', 'Reference',
    function($stateParams, $state, $HUB, $RPC, Reference) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/diff.html',
            scope: {
                path: '=',
                patch: '=',
                status: '=',
                fileSha: '=',
                baseSha: '=',
                headSha: '='
            },
            link: function(scope, elem, attrs) {

                scope.file = null;

                scope.open = true;

                scope.expanded = false;

                scope.selected = Reference.selected;

                scope.references = Reference.get();

                // To Do:
                // fix this

                scope.$watch('patch', function() {

                    if(scope.patch && scope.patch.length) {

                        $HUB.wrap('gitdata', 'getBlob', {
                            user: $stateParams.user,
                            repo: $stateParams.repo,
                            sha: scope.fileSha
                        }, function(err, res) {

                            if(!err) {

                                var file=[], chunks=[];

                                var index = 0;

                                // find the chunks
                                while (index < scope.patch.length) {

                                    if(scope.patch[index].chunk) {

                                        var start=0, end=0, c=[];

                                        while( ++index<scope.patch.length && !scope.patch[index].chunk ) {

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

                                    if( chunks[0] && res.value.content[index].head===chunks[0].start ) {

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
                // actions
                //

                scope.baseRef = function(line) {
                    return (scope.baseSha + '/' + scope.path + '#L' + line.base);
                };

                scope.headRef = function(line) {
                    return (scope.headSha + '/' + scope.path + '#L' + line.head);
                };

                scope.select = function(line) {
                    if(line.head) {
                        Reference.select(scope.headRef(line));
                    }
                };

                scope.go = function(issue) {
                    $state.go('repo.pull.issue', { issue: issue });
                };
            }
        };
    }
]);
