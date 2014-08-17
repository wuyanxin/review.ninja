// *****************************************************
// File Directive
// *****************************************************

module.directive('file', function() {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/file.html',
            scope: {
                path: '=',
                update: '&',
                content: '=',
                headSha: '=',
                reference: '='
            },
            link: function(scope, elem, attrs) {

                // 
                // actions
                //

                scope.match = function(line) {
                    return ( scope.reference.ref===(scope.baseSha + '/' + scope.path + '#L' + line.base) ||
                             scope.reference.ref===(scope.headSha + '/' + scope.path + '#L' + line.head) );
                };

                scope.select = function(line) {

                    if(line.head && !scope.reference.disabled) {

                        var reference = scope.match(line) ? { sha: null, ref: null, type: null, disabled: null } : {
                            sha: scope.headSha,
                            ref: scope.headSha + '/' + scope.path + '#L' + line.head,
                            type: 'selection',
                            disabled: false
                        };

                        scope.update({ reference: reference });
                    }
                };
            }
        };
    }
);
