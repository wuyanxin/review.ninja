// *****************************************************
// Issue List Controller
//
// tmpl: issue/list.html
// path: /:user/:repo/pull/:number?state&issues
// resolve: issues
// *****************************************************

module.controller('IssueListCtrl', ['$scope', '$state', '$stateParams', '$HUB', '$RPC', 'issues', 'Issue',
    function($scope, $state, $stateParams, $HUB, $RPC, issues, Issue) {

        // get the open issues
        $scope.issues = issues;

        // emit to parent controller (repo.pull)
        $scope.$emit('issue:set', null);

        $scope.$watch('issues.value', function() {
            $scope.$emit('reference:set', $scope.issues.value);
        });


        // update the comparison view
        $scope.compComm($scope.pull.base.sha, $scope.head);
    }
]);
