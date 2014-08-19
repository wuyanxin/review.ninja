// *****************************************************
// File Directive
// *****************************************************

module.directive('file', ['$state', function($state) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/file.html',
            scope: {
                path: '=',
                update: '&',
                content: '=',
                headSha: '=',
                selection: '=',
                reference: '='
            },
            link: function(scope, elem, attrs) {

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
