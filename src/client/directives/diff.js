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
                reference: '='
            },
            link: function(scope, elem, attrs) {

                scope.file = null;

                scope.open = true;

                scope.expanded = false;

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

                scope.match = function(line) {
                    return ( scope.reference[(scope.baseSha + '/' + scope.path + '#L' + line.base)] ||
                             scope.reference[(scope.headSha + '/' + scope.path + '#L' + line.head)] );
                };

                scope.selected = function(line) {
                    return scope.selection === scope.headSha + '/' + scope.path + '#L' + line.head;
                };

                scope.select = function(line) {
                    if(line.head && !scope.match(line)) {
                        scope.selection = !scope.selected(line) ? scope.headSha + '/' + scope.path + '#L' + line.head : null;
                    }
                };

                scope.go = function(line) {
                    $state.go('repo.pull.issue', { issue: scope.match(line).issue }).then(function() {
                        // here we can set a special property on line
                        // to distinguish form other "issue" lines
                    });
                };

            }
        };
    }
]);
