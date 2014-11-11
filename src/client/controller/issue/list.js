// *****************************************************
// Issue List Controller
//
// tmpl: issue/list.html
// path: /:user/:repo/pull/:number?state&issues
// resolve: issues
// *****************************************************

module.controller('IssueListCtrl', ['$scope', '$stateParams',
    function($scope, $stateParams, $HUB, $RPC, Issue) {

        // emit to parent controller (repo.pull)
        // $scope.$emit('issue:set', null);

        // $scope.$watch('issues.value', function(value) {
        //     if(value) {
        //         $scope.$emit('reference:set', $scope.issues.value);
        //     }
        // });


        // update the comparison view
        $scope.compComm($scope.pull.base.sha, $scope.head);
    }
]);
