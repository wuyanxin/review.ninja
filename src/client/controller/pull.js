// *****************************************************
// Pull Request Controller
//
// tmpl: pull.html
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
        $scope.selection = {};

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

        // get the details
        // it would be cool if the "issue" could
        // be inherited from the parent list view
        // to avoid having to call github
        $scope.extra = $HUB.call('issues', 'repoIssues', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            labels: 'review.ninja, pull-request-' + $stateParams.number,
            state: 'open',
            per_page: 1
        }, function(err, issues) {
            if(!err) {
                $scope.pull.open_issue = issues.value.length ? issues.value[0] : null;
            }
        });

        // 
        // The issues filter
        //

        $scope.filter = [];

        $scope.clearFilter = function() {
            $scope.filter = [];
        };

        //
        // Events
        //

        $scope.$on('issue:set', function(event, issue) {
            $scope.issue = issue;
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
                    console.log(star);
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
            $HUB.call('pullRequests', 'get', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $stateParams.number
            }, function(err, pull) {
                if(!err) {
                    $scope.pull = pull.value;
                }
            });
        };

        $scope.createIssue = function() {

            if($scope.title) {

                var description = $scope.description ? $scope.description : '';

                // this will expand to  
                // multiple lines in the future
                var reference;

                for(var ref in $scope.selection) {
                    reference = ref;
                }

                $scope.creating = $RPC.call('issue', 'add', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    number: $stateParams.number,
                    repo_uuid: $scope.repo.id,
                    title: $scope.title,
                    body: description,
                    sha: $scope.pull.head.sha,
                    reference: reference
                }, function(err, issue) {
                    if(!err) {
                        $state.go('repo.pull.issue.detail', { issue: issue.value.number }).then(function() {
                            $scope.show = false;
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
