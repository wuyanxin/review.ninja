// *****************************************************
// Pull List Controller
//
// tmpl: pull/list.html
// path: /:user/:repo/pull/:number
// resolve: open, closed 
// *****************************************************

module.controller('PullListCtrl', ['$scope', '$state', '$stateParams', '$HUB', '$RPC', 'issues', 'Issue',
    function($scope, $state, $stateParams, $HUB, $RPC, issues, Issue) {

        // get the open issues
        $scope.issues = issues;

        // emit to parent controller (repo.pull)
        $scope.$emit('issue:set', null);
        $scope.$emit('reference:set', issues.value);


        // obj for createing new issue
        $scope.newIssue = {};

        // update the comparison view
        $scope.compComm($scope.pull.base.sha);

        //
        // actions
        //

        $scope.create = function() {

            // this will expand to  
            // multiple lines in the future
            var reference;

            for(var ref in $scope.selection) {
                reference = ref;
            }

            $RPC.call('issue', 'add', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $stateParams.number,
                repo_uuid: $scope.repo.id,
                title: $scope.newIssue.title,
                body: $scope.newIssue.body,
                sha: $scope.pull.head.sha,
                reference: reference
            }, function(err, issue) {

                // todo: error handling

                if(!err) {
                    $state.go('repo.pull.issue.detail', { issue: issue.value.number });
                }
            });
        };
    }
]);
