// *****************************************************
// Diff File Directive
// *****************************************************

module.directive('diff', ['$stateParams', '$HUB', '$RPC', 'Issue',
    function($stateParams, $HUB, $RPC, Issue) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/diff.html',
            scope: {
                name: '=',
                patch: '=',
                status: '=',
                fileSha: '=',
                pullSha: '=',
                selected: '='
            },
            link: function(scope, elem, attrs) {

                scope.file = null;

                scope.expanded = false;

                // To Do:
                // fix this

                scope.$watch('patch', function(newValue, oldValue) {

                    if(newValue) {

                        $RPC.call('files', 'get', {
                            user: $stateParams.user,
                            repo: $stateParams.repo,
                            sha: scope.fileSha
                        }, function(err, res) {

                            var patch = [];
                            var file = res.value.content;

                            var chunks = [];

                            // find the chunks
                            for(var index=0; index<scope.patch.length; index++) {

                                if(scope.patch[index].chunk) {

                                    var start, end, c=[];

                                    while( ++index<scope.patch.length && !scope.patch[index].chunk ) {

                                        start = start ? start : scope.patch[index].head;

                                        end = scope.patch[index].head ? scope.patch[index].head : end;

                                        c.push(scope.patch[index]);
                                    }

                                    chunks.push({ start:start, end:end, chunk:c });

                                    index = index - 1;
                                }
                            }

                            // insert the chunks

                            var chunk = chunks.shift();

                            for(index=0; index<file.length; index++) {

                                if( chunk && file[index].head===chunk.start ) {

                                    patch = patch.concat( chunk.chunk );

                                    index = chunk.end;

                                    chunk = chunks.shift();

                                    continue;
                                }

                                patch.push(file[index]);
                            }

                            scope.file = patch;

                        });
                    }

                });

                // 
                // actions
                //

                scope.match = Issue.line;

                scope.select = function(line) {
                    if(line.head) {
                        scope.selected = Issue.line(scope.name, line.head);
                        console.log(scope.selected);
                    }   
                };

            }
        };
    }
]);
