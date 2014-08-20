// *****************************************************
// Pull List Controller
//
// tmpl: pull/list.html
// path: /:user/:repo/pull/:number
// resolve: open, closed 
// *****************************************************

module.controller('PullListCtrl', ['$scope', '$state', '$stateParams', '$HUB', '$RPC', 'open', 'closed', 'Issue', 'Reference',
    function($scope, $state, $stateParams, $HUB, $RPC, open, closed, Issue, Reference) {

        // get the open issues
        $scope.open = open;

        // // get the closed issues
        $scope.closed = closed;

        // obj for createing new issue
        $scope.newIssue = {};

        // update the comparison view
        $scope.compComm($scope.pull.base.sha);

        //
        // actions
        //

        $scope.create = function() {

            // this could be an example
            // of a "prewrap"

            $RPC.call('issue', 'add', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $stateParams.number,
                repo_uuid: $scope.repo.id,
                title: $scope.newIssue.title,
                body: $scope.newIssue.body,
                sha: $scope.pull.head.sha,
                reference: Reference.selected()
            }, function(err, issue) {

                // todo: error handling

                if(!err) {
                    $state.go('repo.pull.issue', { issue: issue.value.number });
                }
            });
        };
    }
]);
