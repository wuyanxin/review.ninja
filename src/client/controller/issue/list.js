'use strict';
// *****************************************************
// Issue List Controller
//
// tmpl: issue/list.html
// path: /:user/:repo/pull/:number?state&issues
// resolve: issues
// *****************************************************

module.controller('IssueListCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', 'Issue', 'Reference',
    function($scope, $stateParams, $HUB, $RPC, Issue, Reference) {

        // update the comparison view
        $scope.compComm($scope.pull.base.sha);

        // set the issue sha
        $scope.$parent.$parent.sha = null;

        $scope.anchor = function(issue) {
            return Reference.anchor(issue.sha, issue.path, issue.start);
        };
    }
]);
