'use strict';

// *****************************************************
// Pull Request Controller
//
// tmpl: pull/pull.html
// path: /:user/:repo/pull/:number
// resolve: repo, pull
// *****************************************************

module.controller('PullCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$modal', '$filter', '$HUB', '$RPC', 'Pull', 'Markdown', 'File', 'Comment', 'repo', 'pull', 'socket', '$timeout',
    function($scope, $rootScope, $state, $stateParams, $modal, $filter, $HUB, $RPC, Pull, Markdown, File, Comment, repo, pull, socket, $timeout) {

        // set the states
        $scope.state = 'open';

        $scope.repo = repo.value;

        // get the pull request
        $scope.pull = Pull.status(pull.value) && Pull.stars(pull.value, true) && Markdown.render(pull.value);

        // get the combined statuses
        $scope.status = $HUB.call('statuses', 'getCombined', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            sha: $scope.pull.head.sha
        });

        // get the repository settings for threshold
        $scope.reposettings = $RPC.call('repo', 'get', {
            repo_uuid: repo.value.id
        });

        // get the pull req comments
        $scope.conversation = $HUB.call('issues', 'getComments', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            number: $stateParams.number
        }, function(err, comments) {
            if(!err) {
                comments.affix.forEach(function(comment) {
                    comment = Markdown.render(comment);
                });
            }
        });

        // get review comments
        $scope.review = $HUB.call('pullRequests', 'getComments', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            number: $stateParams.number,
            per_page: 100
        }, function(err, comments) {
            if(!err) {
                comments = Comment.thread(comments);
                comments.affix.forEach(function(comment) {
                    comment = Comment.review(comment) && Markdown.render(comment);
                });
                angular.forEach(comments.thread, function(refs) {
                    angular.forEach(refs, function(ref) {
                        ref.status = Comment.status(ref);
                    });
                });
            }
        });


        //
        // Messages
        //

        $scope.$on('compareCommits', function(event, comp) {
            $scope.comp = comp;
        });


        //
        // Actions
        //

        $scope.setStar = function() {

            var fn = $scope.pull.star ? 'rmv' : 'set';

            $RPC.call('star', fn, {
                repo: $stateParams.repo,
                user: $stateParams.user,
                sha: $scope.pull.head.sha,
                number: $scope.pull.number,
                repo_uuid: $scope.pull.base.repo.id
            });
        };

        // need a better way to handle this
        // alt: prompt user to refresh
        //      with a status bar message
        // $scope.getPullRequest = function() {
        //     $HUB.wrap('pullRequests', 'get', {
        //         user: $stateParams.user,
        //         repo: $stateParams.repo,
        //         number: $stateParams.number
        //     }, function(err, pull) {
        //         if(!err) {

        //             // update the comparison
        //             if($scope.pull.head.sha !== pull.value.head.sha) {
        //                 $scope.compComm($scope.base || $scope.pull.base.sha, pull.value.head.sha);
        //             }

        //             $scope.pull = Pull.status(pull.value) && Pull.stars(pull.value, true) && Markdown.render(pull.value);
        //         }
        //     });
        // };

        $scope.addReviewComment = function(params) {
            if($scope.reviewComment) {
                var path = params.ref.split('#L')[0];
                var position = params.ref.split('#L')[1];
                var sha = (params.base === $scope.pull.base.sha) ? $scope.pull.head.sha : params.base;
                $scope.reviewing = $HUB.call('pullRequests', 'createComment', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    number: $stateParams.number,
                    commit_id: sha,
                    body: $scope.reviewComment || '',
                    path: path,
                    position: position
                }, function(err, comment) {
                    if (!err) {
                        $scope.reviewComment = null;
                    }
                });
            }
        };

        $scope.addComment = function() {
            if($scope.comment) {
                $scope.commenting = $HUB.wrap('issues', 'createComment', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    number: $stateParams.number,
                    body: $scope.comment
                }, function(err, comment) {
                    if(!err) {
                        $scope.comment = null;
                    }
                });
            }
        };


        //
        // Watches
        //

        // $scope.$watch('reference.selection', function(newSelection, oldSelection) {
        //     if(newSelection.ref && !oldSelection.ref && !$scope.show) {
        //         $scope.highlight = true;
        //         $timeout(function() {
        //             $scope.highlight = false;
        //         }, 1000);
        //     }
        // });


        //
        // UI text
        //

        // get star text
        $scope.getStarText = function() {
            if($scope.pull.stars && $scope.reposettings.value) {
                var stars = $scope.pull.stars.length;
                var threshold = $scope.reposettings.value.threshold;
                if(stars < threshold) {
                    return 'Pull Request needs ' + $filter('pluralize')(threshold - stars, 'more ninja star');
                }
                return 'No more ninja stars needed';
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

        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'status', function(args) {
            if($scope.pull.head.sha === args.sha) {
                $HUB.call('statuses', 'getCombined', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    sha: $scope.pull.head.sha
                }, function(err, status) {
                    if(!err) {
                        $scope.status.value = status.value;
                    }
                });
            }
        });

        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'pull_request', function(args) {
            if($scope.pull.number === args.number) {
                if(args.action === 'starred' || args.action === 'unstarred') {
                    $scope.pull = Pull.stars($scope.pull, true);
                }
            }
        });

        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'pull_request_review_comment', function(args) {
            $HUB.call('pullRequests', 'getComment', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: args.id
            }, function(err, comment) {
                if(!err) {
                    var sha = comment.value.commit_id;
                    var ref = comment.value.path + '#L' + comment.value.position;

                    comment.value = Comment.review(comment.value) && Markdown.render(comment.value);
                    $scope.review.thread[sha][ref].status = Comment.status($scope.review.thread[sha][ref]);
                }
            });
        });

        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'issue_comment', function(args) {
            if($scope.pull.number === args.number && args.action === 'created') {
                $HUB.call('issues', 'getComment', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    id: args.id
                }, function(err, comment) {
                    if(!err) {
                        $scope.comments.value.push(Markdown.render(comment.value));
                    }
                });
            }
        });
    }
]);
