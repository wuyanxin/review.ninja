// *****************************************************
// Pull Request Controller
//
// tmpl: pull.html
// path: /:user/:repo/pull/:number
// resolve: repo, pull 
// *****************************************************

module.controller('PullCtrl', ['$scope', '$rootScope', '$stateParams', '$HUB', '$RPC', 'repo', 'pull', 'socket', 'Issue',
    function($scope, $rootScope, $stateParams, $HUB, $RPC, repo, pull, socket, Issue) {

        // get the repo
        $scope.repo = repo.value;

        // get the pull request
        $scope.pull = pull.value;
        $scope.base = $scope.pull.base.sha;
        $scope.head = $scope.pull.head.sha;

        // file reference
        $scope.reference = { sha: null, ref: null, type: null, disabled: null };

        // note: work around for strage angular binding issue
        $scope.update = function(reference) {
            $scope.reference = reference;
        };

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
            repo: $scope.repo.id,
            comm: $scope.pull.head.sha
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
                    base: base
                    
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
                if (!err && res.value.merged) {

                    // instead of doing this, can we just 
                    // set pull.merged to true??
                    // also, potential web socket to update this
                    $HUB.call('pullRequests', 'get', {
                        user: $stateParams.user,
                        repo: $stateParams.repo,
                        number: $stateParams.number
                    }, function(err, pull) {
                        if(!err) {
                            $scope.pull = pull.value;
                        }
                    });
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
            }, function(err, res) {
                if(!err) {
                    $scope.star.value = fn==='set' ? res.value : null;
                }
            });
        };

        $scope.refresh = function() {
            $RPC.call('star', 'all', {
                repo: $scope.repo.id,
                comm: $scope.pull.head.sha
            }, function(err, stars) {
                if(!err) {
                    $scope.pull.stars = stars.value;
                }
            });
        };

        //
        // Websockets
        //

        socket.on($stateParams.user + ':' + $stateParams.repo + ':pull-request-' + $stateParams.number + ':starred', function() {
            $scope.refresh();
        });

        socket.on($stateParams.user + ':' + $stateParams.repo + ':pull-request-' + $stateParams.number + ':unstarred', function() {
            $scope.refresh();
        });
    }
]);
