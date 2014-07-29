// *****************************************************
// Diff File Directive
// *****************************************************

module.directive('diff', ['$stateParams', '$HUB', '$RPC',
    function($stateParams, $HUB, $RPC) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/diff.html',
            scope: {
                path: '=',
                content: '=',
                comments: '=',
                onComment: '&comment'
            },
            link: function(scope, elem, attrs) {

                scope.selected = {};

                // 
                // actions
                //

                scope.add = function(index) {
                    scope.selected[index] = !scope.selected[index];
                };

                scope.$watch('content', function(newVal, oldVal) {
                    if (newVal) {

                        //
                        // FIX THIS
                        //

                        var lines = scope.content.trim().replace(/\t/g, '    ').split('\n');

                        var base = 0;
                        var head = 0;

                        scope.lines = [];

                        for (var i = 0; i < lines.length; i++) {

                            var line = lines[i].substring(1, lines[i].length) || ' ';

                            switch (lines[i][0]) {
                                case '@':

                                    var meta = lines[i].match(/@@(.*?)@@/g)[0];

                                    var range = meta.substring(3, meta.length - 3);

                                    var baseRange = range.split(' ')[0];
                                    var headRange = range.split(' ')[1];

                                    baseRange = baseRange.substring(1, baseRange.length);
                                    headRange = headRange.substring(1, headRange.length);

                                    base = parseInt(baseRange.split(',')[0], 10);
                                    head = parseInt(headRange.split(',')[0], 10);

                                    scope.lines.push({
                                        type: 'meta',
                                        line: meta
                                    });

                                    break;
                                case '+':
                                    scope.lines.push({
                                        type: 'addition',
                                        line: line,
                                        head: head++
                                    });
                                    break;
                                case '-':
                                    scope.lines.push({
                                        type: 'deletion',
                                        line: line,
                                        base: base++
                                    });
                                    break;
                                case '\\':
                                    break;
                                default:
                                    scope.lines.push({
                                        line: line,
                                        head: head++,
                                        base: base++
                                    });
                                    break;
                            }
                        }
                    }
                });
            }
        };
    }
]);
