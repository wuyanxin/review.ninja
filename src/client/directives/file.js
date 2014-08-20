// *****************************************************
// File Directive
// *****************************************************

module.directive('file', ['$state', 'Reference', function($state, Reference) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/file.html',
            scope: {
                path: '=',
                update: '&',
                content: '=',
                headSha: '='
            },
            link: function(scope, elem, attrs) {

                scope.selected = Reference.selected;

                scope.references = Reference.get();

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
