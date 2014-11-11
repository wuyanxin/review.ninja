// *****************************************************
// Sidebar Controller
//
// tmpl: pull/sidebar.html
// path: /:user/:repo/pull/:number
// resolve: open, closed
// *****************************************************

module.controller('SidebarCtrl', ['$scope', '$state', '$stateParams', '$HUB', '$RPC', 'socket', 'Issue',
    function($scope, $state, $stateParams, $HUB, $RPC, socket, Issue) {

        $scope.state = 'open';

        $scope.open = $HUB.call('issues', 'repoIssues', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            milestone: $scope.pull.milestone.number,
            state: 'open'
        }, function(err, issues) {
            issues.value = issues.value || [];
            if(!err) {
                issues.affix.forEach(function(issue) {
                    issue = Issue.parse(issue);
                });
            }
        });

        $scope.closed = $HUB.call('issues', 'repoIssues', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            milestone: $scope.pull.milestone.number,
            state: 'closed'
        }, function(err, issues) {
            issues.value = issues.value || [];
            if(!err) {
                issues.affix.forEach(function(issue) {
                    issue = Issue.parse(issue);
                });
            }
        });

        //
        // actions
        //

        $scope.createIssue = function() {

            if($scope.title) {

                var body = $scope.description ? $scope.description : '';

                // this will expand to multiple lines in the future
                var reference = $scope.selection[0] ? $scope.selection[0].ref : null;

                $scope.creating = $RPC.call('issue', 'add', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    sha: $scope.pull.head.sha,
                    number: $stateParams.number,
                    repo_uuid: $scope.pull.base.repo.id,
                    title: $scope.title,
                    body: body,
                    reference: reference
                }, function(err, issue) {
                    if(!err) {
                        $state.go('repo.pull.issue.detail', {issue: issue.value.number}).then(function() {
                            $scope.show = null;
                            $scope.title = null;
                            $scope.description = null;
                        });
                    }
                });
            }
        };

        //
        // Websockets
        //

        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'issues', function(args) {
            var i, issue;
            if(args.action === 'opened' && $scope.pull.number === args.pull) {
                $HUB.call('issues', 'getRepoIssue', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    number: args.number
                }, function(err, issue) {
                    if(!err) {
                        $scope.open.value.unshift(Issue.parse(issue.value));
                    }
                });
            }
            if(args.action === 'closed' && $scope.pull.number === args.pull) {
                for(i = 0; i < $scope.open.value.length; i++) {
                    if($scope.open.value[i].number === args.number) {
                        issue = $scope.open.value[i];
                        issue.state = 'closed';
                        $scope.open.value.splice(i, 1);
                        $scope.closed.value.unshift(issue);
                    }
                }
            }
            if(args.action === 'reopened' && $scope.pull.number === args.pull) {
                for(i = 0; i < $scope.closed.value.length; i++) {
                    if($scope.closed.value[i].number === args.number) {
                        issue = $scope.closed.value[i];
                        issue.state = 'open';
                        $scope.closed.value.splice(i, 1);
                        $scope.open.value.unshift(issue);
                    }
                }
            }
        });
    }
]);
