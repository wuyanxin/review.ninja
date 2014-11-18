// *****************************************************
// Pull Request Controller
//
// tmpl: pull/pull.html
// path: /:user/:repo/pull/:number
// resolve: repo, pull
// *****************************************************

module.controller('PullCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$modal', '$HUB', '$RPC', 'Pull', 'Issue', 'Comment', 'repo', 'pull', 'socket', '$timeout',
    function($scope, $rootScope, $state, $stateParams, $modal, $HUB, $RPC, Pull, Issue, Comment, repo, pull, socket, $timeout) {

        // set the states
        $scope.state = 'open';

        // set the shas
        $scope.sha = null;
        $scope.base = pull.value.base.sha;
        $scope.head = pull.value.head.sha;

        // get the pull request
        $scope.pull = Pull.milestone(pull.value) && Pull.render(pull.value) && Pull.stars(pull.value);

        // set the line selection
        $scope.reference = {selection: {}, issues: null};

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

        // get the statuses
        $scope.statuses = {};
        $HUB.call('statuses', 'get', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            sha: pull.value.head.sha
        }, function(err, statuses) {
            if(!err) {
                var states = {};
                statuses.value.forEach(function(status) {
                    if(!$scope.statuses[status.context]) {
                        states[status.state] = status.state;
                        $scope.statuses[status.context] = status;
                    }
                });

                $scope.status = states.failure || states.error || states.pending || states.success || 'pending';
            }
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

        // get the open issues
        $scope.open = $HUB.call('issues', 'repoIssues', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            state: 'open',
            milestone: $scope.pull.milestone ? $scope.pull.milestone.number : null
        }, function(err, issues) {
            issues.value = issues.value || [];
            if(!err) {
                issues.affix.forEach(function(issue) {
                    issue = Issue.parse(issue);
                });
            }
        });

        // get the closed issues
        $scope.closed = $HUB.call('issues', 'repoIssues', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            state: 'closed',
            milestone: $scope.pull.milestone ? $scope.pull.milestone.number : null
        }, function(err, issues) {
            issues.value = issues.value || [];
            if(!err) {
                issues.affix.forEach(function(issue) {
                    issue = Issue.parse(issue);
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

        $scope.createIssue = function() {
            if($scope.title) {
                $scope.creatingIssue = true;
                $RPC.call('issue', 'add', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    sha: $scope.pull.head.sha,
                    number: $stateParams.number,
                    repo_uuid: $scope.pull.base.repo.id,
                    title: $scope.title,
                    body: $scope.description || '',
                    reference: $scope.reference.selection.ref
                }, function(err, issue) {
                    if(!err) {
                        $state.go('repo.pull.issue.detail', {issue: issue.value.number}).then(function() {
                            $scope.show = null;
                            $scope.title = null;
                            $scope.description = null;
                            $scope.reference.selection = {};
                            $scope.creatingIssue = false;
                        });
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

        socket.on($stateParams.user + ':' + $stateParams.repo + ':' + 'issues', function(args) {
            var i, issue;
            if(args.action === 'opened' && $scope.pull.number === args.pull) {
                $HUB.call('issues', 'getRepoIssue', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    number: args.number
                }, function(err, issue) {
                    if(!err) {
                        $scope.open.value.unshift(Issue.parse(issue.value));
                        $scope.pull.milestone = issue.value.milestone;
                        $scope.pull = Pull.milestone($scope.pull);
                    }
                });
            }
            if(args.action === 'closed' && $scope.pull.number === args.pull) {
                for(i = 0; i < $scope.open.value.length; i++) {
                    if($scope.open.value[i].number === args.number) {
                        issue = $scope.open.value[i];
                        issue.state = 'closed';
                        $scope.open.value.splice(i, 1);
                        $scope.closed.value.unshift(issue);
                    }
                    if($scope.pull.milestone) {
                        $scope.pull.milestone.open_issues--;
                        $scope.pull.milestone.closed_issues++;
                    }
                }
            }
            if(args.action === 'reopened' && $scope.pull.number === args.pull) {
                for(i = 0; i < $scope.closed.value.length; i++) {
                    if($scope.closed.value[i].number === args.number) {
                        issue = $scope.closed.value[i];
                        issue.state = 'open';
                        $scope.closed.value.splice(i, 1);
                        $scope.open.value.unshift(issue);
                    }
                    if($scope.pull.milestone) {
                        $scope.pull.milestone.open_issues++;
                        $scope.pull.milestone.closed_issues--;
                    }
                }
            }
        });
    }
]);
