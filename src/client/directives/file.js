// *****************************************************
// File Directive
// *****************************************************

module.directive('file', ['$state', 'reference', 
    function($state, reference) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/file.html',
            scope: {
                path: '=',
                content: '=',
                headSha: '='
            },
            link: function(scope, elem, attrs) {

                scope.reference = reference;

                // 
                // actions
                //

                scope.match = function(line) {
                    return ( scope.reference.ref===(scope.baseSha + '/' + scope.path + '#L' + line.base) ||
                             scope.reference.ref===(scope.headSha + '/' + scope.path + '#L' + line.head) );
                };

                scope.select = function(line) {
                    if($state.current.name!=='repo.pull.issue' && line.head) {
                        reference.type = !scope.match(line) ? 'selection' : null;
                        reference.sha = !scope.match(line) ? scope.headSha : null;
                        reference.ref = !scope.match(line) ? scope.headSha + '/' + scope.path + '#L' + line.head : null;
                    }   
                };
            }
        };
    }
]);
