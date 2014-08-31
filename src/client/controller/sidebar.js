// *****************************************************
// Sidebar Controller
//
// tmpl: pull/sidebar.html
// path: /:user/:repo/pull/:number
// resolve: open, closed
// *****************************************************

module.controller('SidebarCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$RPC', 'open', 'closed', 'Issue',
    function($rootScope, $scope, $state, $stateParams, $RPC, open, closed, Issue) {

        //
        // actions
        //

        $scope.createIssue = function() {

            if($scope.title) {

                var body = $scope.description ? $scope.description : '';

                // this will expand to
                // multiple lines in the future
                var reference = $scope.selection[0] ? $scope.selection[0].ref : null;

                $scope.creating = $RPC.call('issue', 'add', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    number: $stateParams.number,
                    repo_uuid: $scope.repo.id,
                    title: $scope.title,
                    body: body,
                    sha: $scope.pull.head.sha,
                    reference: reference
                }, function(err, issue) {
                    if(!err) {
                        open.value.unshift(Issue.parse(issue.value));
                        $rootScope.$emit('issues:open', $rootScope.open + 1);

                        $state.go('repo.pull.issue.detail', { issue: issue.value.number }).then(function() {
                            $scope.show = null;
                            $scope.title = null;
                            $scope.description = null;
                        });
                    }
                });
            }
        };
    }
]);
