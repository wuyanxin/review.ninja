// *****************************************************
// Repository Controller
//
// tmpl: pull.html
// path: /:user/:repo
// resolve: repo 
// *****************************************************

module.controller('RepoCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', '$modal', 'repo',
    function($scope, $stateParams, $HUB, $RPC, $modal, repo) {

        $scope.pullRequestState = 'open';

        // get the repo
        $scope.repo = repo;
        // get the pull requests
        $RPC.call('pull', 'getAll', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            state: 'all'
        }, function(err, pulls) {

            $scope.pulls = pulls;

            // get stars of each pull request
            $scope.pulls.value.forEach(function(pull) {
                $RPC.call('star', 'all', {
                    repo: $scope.repo.value.id,
                    comm: pull.head.sha
                }, function(err, status) {
                    if (!err) {
                        pull.stars = status.value;
                    }
                });
            });

            // get status of each pull request
            $scope.pulls.value.forEach(function(pull) {
                $HUB.call('issues', 'repoIssues', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    labels: 'review.ninja,pull-request-'+pull.number,
                    state: 'all'
                }, function(err, issues) {
                    console.log(pull.user.login+': '+pull.title);
                    console.log(issues.value);
                    if(issues.value.length > 0) {
                        pull.hasIssues = true;
                        pull.allIssuesResolved = true;
                        issues.value.forEach(function(issue) {
                            if(issue.state == 'open') {
                                pull.allIssuesResolved = false;
                            } 
                        });
                    }
                });
            });
        });
    }
]);
