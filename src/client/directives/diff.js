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
                lines: '=',
                comments: '=',
                onComment: '&comment'
            },
            link: function(scope, elem, attrs) {

                // 
                // actions
                //

                scope.selected = {};

                scope.add = function(index) {
                    scope.selected[index] = !scope.selected[index];
                    if(!scope.selected[index]) {
                        delete scope.selected[index];
                    }
                    var ranges = [];
                    for(var selection in scope.selected) {
                        selection = parseInt(selection);
                        if(ranges[ranges.length-1] && ranges[ranges.length-1].end+1 == selection) {
                            ranges[ranges.length-1].end = selection;
                            continue;
                        }
                        ranges.push({start: selection, end: selection});
                    }
                };

                console.log( scope.lines );
            }
        };
    }
]);
