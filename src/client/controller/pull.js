// *****************************************************
// Pull Request Controller
//
// tmpl: pull/pull.html
// path: /:user/:repo/pull/:number
// resolve: repo, pull 
// *****************************************************

module.controller('PullCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$HUB', '$RPC', 'repo', 'pull', 'socket', 'Issue',
    function($scope, $rootScope, $state, $stateParams, $HUB, $RPC, repo, pull, socket, Issue) {

        // get the repo
        $scope.repo = repo.value;

        // get the pull request
        $scope.pull = pull.value;
        $scope.base = $scope.pull.base.sha;
        $scope.head = $scope.pull.head.sha;

        // file reference
        $scope.reference = {};
        $scope.selection = [];

        // get the files (for the diff view)
        $scope.files = $HUB.wrap('pullRequests', 'getFiles', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            number: $stateParams.number
        });

        // get the tree (for the file browser)
        $scope.tree = $HUB.call('gitdata', 'getTree', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            sha: $scope.pull.head.sha
        });

        // get the star
        $scope.star = $RPC.call('star', 'get', {
            sha: $scope.pull.head.sha,
            repo_uuid: $scope.repo.id
        });

        // get the users for each star
        $scope.pull.stars.forEach(function(star) {
            star.user = $HUB.call('user', 'getFrom', {
                user: star.name
            });
        });

        //
        // Events
        //

        $scope.$on('issue:set', function(event, issue) {
            $scope.issue = issue;
            $scope.selection = [];
        });

        $scope.$on('reference:set', function(event, issues) {

            var reference = [];

            issues.forEach(function(issue) {
                if(issue.sha && issue.ref) {

                    var key = issue.sha + '/' + issue.ref;

                    if(!reference[key]) {
                        reference[key] = [];
                    }

                    reference[key].push({ 
                        ref: issue.ref, 
                        sha: issue.sha, 
                        issue: issue.number 
                    });
                }
            });

            $scope.reference = reference;
        });


        //
        // Actions
        //

        $scope.compComm = function(base) {

            if($scope.base!==base && $scope.head!==base) {

                $scope.base = base;

                $HUB.wrap('repos', 'compareCommits', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    head: $scope.head,
                    base: $scope.base
                }, function(err, res) {
                    if(!err) {
                        $scope.files.value = res.value.files;
                    }
                });
            }
        };

        $scope.merge = function() {
            $HUB.call('pullRequests', 'merge', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $stateParams.number
            }, function(err, res) {

                // todo: handle error or unmerged

                if(!err && res.value.merged) {
                    $scope.pull = $scope.refreshPullRequest();
                }
            });
        };

        $scope.toggle = function() {

            var fn = $scope.star.value ? 'rmv' : 'set';

            $RPC.call('star', fn, {
                repo: $stateParams.repo,
                user: $stateParams.user,
                sha: $scope.pull.head.sha,
                number: $stateParams.number,
                repo_uuid: $scope.repo.id
            }, function(err, star) {
                if(!err) {
                    $scope.star.value = fn==='set' ? star.value : null;
                }
            });
        };

        $scope.refreshStars = function() {
            $RPC.call('star', 'all', {
                sha: $scope.pull.head.sha,
                repo_uuid: $scope.repo.id
            }, function(err, stars) {
                if(!err) {
                    $scope.pull.stars = stars.value;
                    $scope.pull.stars.forEach(function(star) {
                        star.user = $HUB.call('user', 'getFrom', {
                            user: star.name
                        });
                    });
                }
            });
        };

        $scope.refreshPullRequest = function() {
            $HUB.wrap('pullRequests', 'get', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $stateParams.number
            }, function(err, pull) {
                if(!err) {
                    $scope.pull = pull.value;
                }
            });
        };

        //
        // Websockets
        //

        socket.on($stateParams.user + ':' + $stateParams.repo + ':pull-request-' + $stateParams.number + ':starred', function() {
            $scope.refreshStars();
        });

        socket.on($stateParams.user + ':' + $stateParams.repo + ':pull-request-' + $stateParams.number + ':unstarred', function() {
            $scope.refreshStars();
        });
        
        socket.on($stateParams.user + ':' + $stateParams.repo + ':pull-request-' + $stateParams.number +':merged', function() {
            $scope.refreshPullRequest();
        });
    }
]);
