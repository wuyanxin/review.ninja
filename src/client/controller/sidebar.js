// *****************************************************
// Sidebar Controller
//
// tmpl: pull/sidebar.html
// path: /:user/:repo/pull/:number
// resolve: open, closed
// *****************************************************

module.controller('SidebarCtrl', ['$scope', '$state', '$stateParams', '$HUB', '$RPC', 'socket', 'Issue',
    function($scope, $state, $stateParams, $HUB, $RPC, socket, Issue) {

        $scope.$parent.open = $HUB.call('issues', 'repoIssues', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            state: 'open',
            milestone: $scope.pull.milestone ? $scope.pull.milestone.number : null
        }, function(err, issues) {
            issues.value = issues.value || [];
            if(!err) {
                issues.affix.forEach(function(issue) {
                    issue = Issue.parse(issue);
                });
            }
        });

        $scope.$parent.closed = $HUB.call('issues', 'repoIssues', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            state: 'closed',
            milestone: $scope.pull.milestone ? $scope.pull.milestone.number : null
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
                        $scope.$parent.open.value.unshift(Issue.parse(issue.value));
                    }
                });
            }
            if(args.action === 'closed' && $scope.pull.number === args.pull) {
                for(i = 0; i < $scope.$parent.open.value.length; i++) {
                    if($scope.$parent.open.value[i].number === args.number) {
                        issue = $scope.$parent.open.value[i];
                        issue.state = 'closed';
                        $scope.$parent.open.value.splice(i, 1);
                        $scope.$parent.closed.value.unshift(issue);
                    }
                }
            }
            if(args.action === 'reopened' && $scope.pull.number === args.pull) {
                for(i = 0; i < $scope.$parent.closed.value.length; i++) {
                    if($scope.$parent.closed.value[i].number === args.number) {
                        issue = $scope.$parent.closed.value[i];
                        issue.state = 'open';
                        $scope.$parent.closed.value.splice(i, 1);
                        $scope.$parent.open.value.unshift(issue);
                    }
                }
            }
        });
    }
]);
