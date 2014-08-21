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

                scope.Reference = Reference;

                // 
                // actions
                //

                scope.headRef = function(line) {
                    return (scope.headSha + '/' + scope.path + '#L' + line.head);
                };

                scope.select = function(line) {
                    if(line.head) {
                        Reference.select(scope.headRef(line));
                    }
                };

                scope.go = function(headRefs) {

                    var issues = [];

                    if(headRefs) {
                        for(var i=0; i<headRefs.length; i++) {
                            issues.push(headRefs[i].issue);
                        }
                    }

                    if(issues.length === 1) {
                        $state.go('repo.pull.issue.detail', { issue: issues[0] });
                    }
                    else {
                        $state.go('repo.pull.issue.master', { issues: issues });
                    }
                };
            }
        };
    }
]);
