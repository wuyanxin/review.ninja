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

        // get the open pull requests
        $scope.open = $HUB.wrap('pullRequests', 'getAll', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            state: 'open'
        }, function(err, res) {
            if(!err) {
                res.affix.forEach(function(pull) {
                    pull = getDetails(pull);
                });   
            }
        });

        // get the closed pull requests
        $scope.closed = $HUB.wrap('pullRequests', 'getAll', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            state: 'closed'
        }, function(err, res) {
            if(!err) {
                res.affix.forEach(function(pull) {
                    pull = getDetails(pull);
                });   
            }
        });

        // set the default state
        $scope.type = 'open';

        //
        // actions
        //

        var getDetails = function(pull) {

            $HUB.call('issues', 'repoIssues', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                labels: 'review.ninja, pull-request-' + pull.number,
                state: 'open',
                per_page: 1
            }, function(err, issues) {
                if(!err) {
                    pull.open_issue = issues.value.length ? issues.value[0] : null;
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
                    pull.closed_issue = issues.value.length ? issues.value[0] : null;
                }
            });

            return pull;
        };
    }
]);
