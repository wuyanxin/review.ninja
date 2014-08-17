// *****************************************************
// Pull List Controller
//
// tmpl: pull/list.html
// path: /:user/:repo/pull/:number
// resolve: open, closed 
// *****************************************************

module.controller('PullListCtrl', ['$scope', '$state', '$stateParams', '$HUB', '$RPC', 'open', 'closed', 'Issue',
    function($scope, $state, $stateParams, $HUB, $RPC, open, closed, Issue) {

        // get the open issues
        $scope.open = open.value;

        // get the closed issues
        $scope.closed = closed.value;

        // obj for createing new issue
        $scope.issue = {};

        // file reference
        $scope.update({ sha: null, ref: null, type: null, disabled: null });

        // parse the comments
        $scope.open.forEach(function(issue) {
            issue = Issue.parse(issue);
        });
        $scope.closed.forEach(function(issue) {
            issue = Issue.parse(issue);
        });

        // update the comparison view
        $scope.compComm($scope.pull.value.base.sha);

        //
        // actions
        //

        $scope.create = function() {

            $RPC.call('issue', 'add', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $stateParams.number,
                repo_uuid: $scope.repo.value.id,
                title: $scope.issue.title,
                body: $scope.issue.body,
                sha: $scope.pull.value.head.sha,
                reference: $scope.reference.ref
            }, function(err, issue) {

                // to do: error handling

                if(!err) {
                    console.log(issue.value);
                    $state.go('repo.pull.issue', { issue: issue.value.number });
                }
            });
        };
    }
]);
