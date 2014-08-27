// *****************************************************
// Pull List Controller
//
// tmpl: pull/list.html
// path: /:user/:repo/pull/:number
// resolve: open, closed 
// *****************************************************

module.controller('PullListCtrl', ['$scope', '$state', '$stateParams', '$HUB', '$RPC', 'issues', 'Issue',
    function($scope, $state, $stateParams, $HUB, $RPC, issues, Issue) {

        // filter the issues
        var filtered = [];
        var filter = $stateParams.issues ? $stateParams.issues.split(',') : null;

        if(filter) {
            issues.value.forEach(function(issue) {
                if(filter.indexOf(issue.number.toString()) > -1) {
                    filtered.push(issue);
                }
            });
        }

        // get the open issues
        $scope.issues = filtered.length ? filtered : issues.value;

        // emit to parent controller (repo.pull)
        $scope.$emit('issue:set', null);
        $scope.$emit('reference:set', $scope.issues);

        // update the comparison view
        $scope.compComm($scope.pull.base.sha);
    }
]);
