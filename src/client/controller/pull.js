// *****************************************************
// Pull Request Controller
//
// tmpl: pull/pull.html
// path: /:user/:repo/pull/:number
// resolve: repo, pull
// *****************************************************

module.controller('PullCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$modal', '$HUB', '$RPC', 'Pull', 'Comment', 'repo', 'pull', 'socket',
    function($scope, $rootScope, $state, $stateParams, $modal, $HUB, $RPC, Pull, Comment, repo, pull, socket) {

        // get the pull request
        $scope.base = pull.value.base.sha;
        $scope.head = pull.value.head.sha;
        $scope.pull = Pull.milestone(pull.value) && Pull.render(pull.value) && Pull.stars(pull.value);

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
            sha: pull.value.head.sha
        });

        // get the star
        $scope.star = $RPC.call('star', 'get', {
            sha: pull.value.head.sha,
            repo_uuid: pull.value.base.repo.id
        });

        // get the pull req comments
        $scope.comments = $HUB.call('issues', 'getComments', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            number: $stateParams.number
        }, function(err, comments) {
            if(!err) {
                comments.affix.forEach(function(comment) {
                    comment = Comment.render(comment);
                });
            }
        });


        //
        // Actions
        //

        $scope.compComm = function(base, head) {

            if(($scope.base !== base || $scope.head !== head) && base !== head) {
                $HUB.wrap('repos', 'compareCommits', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    base: base,
                    head: head
                }, function(err, res) {
                    if(!err) {
                        $scope.base = base;
                        $scope.head = head;
                        $scope.files.value = res.value.files;
                    }
                });
            }
        };

        $scope.setStar = function() {

            var fn = $scope.star.value ? 'rmv' : 'set';

            $RPC.call('star', fn, {
                repo: $stateParams.repo,
                user: $stateParams.user,
                sha: $scope.pull.head.sha,
                number: $scope.pull.number,
                repo_uuid: $scope.pull.base.repo.id
            }, function(err, star) {
                if(!err) {
                    $scope.star.value = !$scope.star.value ? star.value : null;
                }
            });
        };

        $scope.mergePullRequest = function() {

            $scope.merge = $HUB.call('pullRequests', 'merge', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $stateParams.number
            }, function(err, pull) {

                // todo: handle error or unmerged

                if(!err && pull.value.merged) {
                    $scope.pull.merged = true;
                    $scope.getPullRequest();
                }
            });
        };

        $scope.getPullRequest = function() {
            $HUB.wrap('pullRequests', 'get', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $stateParams.number
            }, function(err, pull) {
                if(!err) {
                    if($scope.pull.head.sha !== pull.value.head.sha) {

                        // clear star
                        $scope.star.value = null;

                        // update the comparison
                        $scope.compComm($scope.base, pull.value.head.sha);

                        // update the tree
                        $HUB.call('gitdata', 'getTree', {
                            user: $stateParams.user,
                            repo: $stateParams.repo,
                            sha: pull.value.head.sha
                        }, function(err, tree) {
                            if(!err) {
                                $scope.tree.value = tree.value;
                            }
                        });
                    }

                    $scope.pull = Pull.milestone(pull.value) && Pull.render(pull.value) && Pull.stars(pull.value);
                }
            });
        };

        $scope.addComment = function() {
            if($scope.comment) {
                $scope.commenting = $HUB.wrap('issues', 'createComment', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    number: $stateParams.number,
                    body: $scope.comment
                });
                $scope.comment = null;
            }
        };

        //
        // Modals
        //

        $scope.badge = function() {
            var modal = $modal.open({
                templateUrl: '/modals/templates/badge.html',
                controller: 'BadgeCtrl'
            });
        };

        //
        // Websockets
        //

        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'pull_request', function(args) {
            if($scope.pull.number === args.number) {
                if(args.action === 'starred' || args.action === 'unstarred') {
                    $scope.pull = Pull.stars($scope.pull);
                }
                if(args.action === 'closed' || args.action === 'reopened' || args.action === 'synchronize') {
                    $scope.getPullRequest();
                }
            }
        });

        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'issue_comment', function(args) {
            if($scope.pull.number === args.number && args.action === 'created') {
                $HUB.call('issues', 'getComment', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    id: args.id
                }, function(err, comment) {
                    if(!err) {
                        $scope.comments.value.push(Comment.render(comment.value));
                    }
                });
            }
        });
    }
]);
