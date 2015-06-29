'use strict';

// *****************************************************
// Pull Request Controller
//
// tmpl: pull/pull.html
// path: /:user/:repo/pull/:number
// resolve: repo, pull
// *****************************************************

module.controller('PullCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$modal', '$filter', '$HUB', '$RPC', 'Pull', 'Issue', 'Markdown', 'File', 'repo', 'pull', 'socket', '$timeout',
    function($scope, $rootScope, $state, $stateParams, $modal, $filter, $HUB, $RPC, Pull, Issue, Markdown, File, repo, pull, socket, $timeout) {

        // set the states
        $scope.state = 'open';

        $scope.repo = repo.value;

        $scope.sha = null;

        // get the pull request
        $scope.pull = Pull.status(pull.value) && Pull.stars(pull.value, true) && Markdown.render(pull.value);

        // set the line selection
        $scope.reference = {selection: {}, issues: null};

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
            number: $stateParams.number
        }, function(err, comments) {
            if(!err) {
                comments.affix.forEach(function(comment) {
                    comment = Markdown.render(comment);
                });
            }
        });


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
        // Actions
        //

        $scope.compComm = function(base, head) {
            head = head || $scope.pull.head.sha;
            base = base !== head ? base : $scope.pull.base.sha;
            if($scope.base !== base || $scope.head !== head) {
                $HUB.wrap('repos', 'compareCommits', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    base: base,
                    head: head
                }, function(err, comp) {
                    if(!err) {
                        $scope.base = base;
                        $scope.head = head;
                        $scope.files = File.getFileTypes(comp.value.files);
                    }
                });
            }
        };

        // temporary
        $scope.compComm($scope.pull.base.sha, $scope.pull.head.sha);

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

        $scope.getPullRequest = function() {
            $HUB.wrap('pullRequests', 'get', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $stateParams.number
            }, function(err, pull) {
                if(!err) {

                    // update the comparison
                    if($scope.pull.head.sha !== pull.value.head.sha) {
                        $scope.compComm($scope.base || $scope.pull.base.sha, pull.value.head.sha);
                    }

                    $scope.pull = Pull.status(pull.value) && Pull.stars(pull.value, true) && Markdown.render(pull.value);
                }
            });
        };

        $scope.addReviewComment = function() {

            if($scope.reviewComment && $scope.reference.selection) {
                $scope.reviewing = $HUB.call('pullRequests', 'createComment', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    number: $stateParams.number,
                    commit_id: $scope.pull.head.sha,
                    body: $scope.reviewComment || '',
                    path: $scope.reference.selection.path,
                    position: $scope.reference.selection.start
                }, function(err, issue) {
                    // if(err) {
                    //     $scope.creatingIssue = false;
                    // } else {
                    //     $state.go('repo.pull.issue.detail', {issue: issue.value.number}).then(function() {
                    //         $scope.show = null;
                    //         $scope.title = null;
                    //         $scope.description = null;
                    //         $scope.reference.selection = {};
                    //         $scope.creatingIssue = false;
                    //     });
                    // }
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

        $scope.$watch('reference.selection', function(newSelection, oldSelection) {
            if(newSelection.ref && !oldSelection.ref && !$scope.show) {
                $scope.highlight = true;
                $timeout(function() {
                    $scope.highlight = false;
                }, 1000);
            }
        });

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
                        $scope.comments.value.push(Markdown.render(comment.value));
                    }
                });
            }
        });
    }
]);
