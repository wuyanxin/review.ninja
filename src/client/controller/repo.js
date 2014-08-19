// *****************************************************
// Repository Controller
//
// tmpl: pull.html
// path: /:user/:repo
// resolve: repo 
// *****************************************************

module.controller('RepoCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', '$modal', 'repo',

    function($scope, $stateParams, $HUB, $RPC, $modal, repo) {

        // get the repo
        $scope.repo = repo;

        // $HUB.wrap('pullRequests', 'getAll', {
        //     user: $stateParams.user,
        //     repo: $stateParams.repo,
        //     state: 'open'
        // }, function(err, pulls) {

        //     if(!err) {
        //         pulls = getDetails(pulls);

        //         $scope.open.value = $scope.open.value.concat(pulls.value);
        //         $scope.open.meta = pulls.meta;
   
        //         $HUB.call('page','hasNextPage', $scope.open.meta, function(err,res,meta){

        //             $scope.hasMoreOpen = res.value;
                    
        //         });

        //     }   

        // });

        $scope.open = $HUB.wrap('pullRequests', 'getAll', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            state: 'open'
        });

        $scope.closed = $HUB.wrap('pullRequests', 'getAll', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            state: 'closed'
        });

        var getDetails = function(pulls) {
            // get stars of each pull request
            pulls.value.forEach(function(pull) {

                $RPC.call('star', 'all', {
                    repo: $scope.repo.value.id,
                    comm: pull.head.sha
                }, function(err, status) {
                    if (!err) {
                        pull.stars = status.value;
                    }
                });

                $HUB.call('issues', 'repoIssues', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    labels: 'review.ninja, pull-request-' + pull.number,
                    state: 'open',
                    per_page: 1
                }, function(err, issues) {
                    if(!err) {
                        pull.open_issue = issues;
                    }

                });

                $HUB.call('issues', 'repoIssues', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    labels: 'review.ninja, pull-request-' + pull.number,
                    state: 'closed',
                    per_page: 1
                }, function(err, issues) {
                    if(!err) {
                        pull.closed_issue = issues;
                    }

                });


            });

            return pulls;
        };

        //
        // actions
        //


    }
]);
