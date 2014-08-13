// *****************************************************
// Pull Request Controller
//
// tmpl: pull.html
// path: /:user/:repo/pull/:number
// resolve: repo, pull 
// *****************************************************

module.controller('IssueCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', '$state', 'repo', 'pull', 'issue',
    function($scope, $stateParams, $HUB, $RPC, $state, repo, pull, issue) {

        // get the repo
        $scope.repo = repo;

        // get the pull request
        $scope.pull = pull;

        $HUB.call('gitdata', 'getReference', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            ref: 'heads/'+pull.value.base.ref
        }, function(err, data) {
            $scope.pull.value.base.head_sha = data.value.object.sha;
        });

        // get the issue
        $scope.issue = Issue(issue);
        
        $scope.comments = $HUB.call('issues', 'getComments', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            number: $stateParams.issue
        });

        $scope.files = $RPC.call('files', 'all', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            number: $stateParams.number
        });

        //
        // Actions
        //

        $scope.compComm = function(base, head) {
            $scope.currentCommit = base;

            $RPC.call('files', 'compare', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                base: base,
                head: head
            }, function(err, res) {
                if(!err) {
                    $scope.files.value = res.value.files;
                }
            });
        };

        $scope.close = function() {
            $HUB.call('issues', 'edit', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $stateParams.issue,
                state: 'closed'
            }, function(err, data) {
                $state.go('pull', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    number: $stateParams.number 
                });
            });
        };
    }
]);
