// *****************************************************
// Pull Request Controller
//
// tmpl: pull.html
// path: /:user/:repo/pull/:number
// resolve: repo, pull 
// *****************************************************

module.controller('PullCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', '$modal', 'repo', 'pull', 'socket', 'Issue',
    function($scope, $stateParams, $HUB, $RPC, $modal, repo, pull, socket, Issue) {

        // get the repo
        $scope.repo = repo;

        // get the pull request
        $scope.pull = pull;
        $scope.currentCommit = $scope.pull.value.base.sha;

        $scope.selection = null;

        // for the diff view
        $scope.head = $scope.pull.value.head.sha;
        $scope.base = $scope.pull.value.base.sha;

        // get the commit
        $scope.comm = $HUB.call('repos', 'getCommit', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            sha: $scope.pull.value.head.sha
        });

        // get the commits
        $scope.commits = $HUB.call('pullRequests', 'getCommits', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            number: $stateParams.number,
        });

        // get the base commits
        $scope.baseCommits = $HUB.call('repos', 'getCommits', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            sha: $scope.pull.value.base.sha,
            per_page: 15
        });

        // get the statuses
        $scope.stat = $HUB.call('statuses', 'get', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            sha: $scope.pull.value.head.sha,
        });

        // get the files (for the diff)
        // $scope.files = $HUB.call('pullRequests', 'getFiles', {
        //     user: $stateParams.user,
        //     repo: $stateParams.repo,
        //     number: $stateParams.number
        // });

        $scope.files = $RPC.call('files', 'all', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            number: $stateParams.number
        }, function(err, files) {
            
        });

        // get the tree (for the file browser)
        $scope.tree = $HUB.call('gitdata', 'getTree', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            sha: $scope.pull.value.head.sha
        });

        // get issues
        $scope.issue = $HUB.call('issues', 'repoIssues', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            labels: 'review.ninja,pull-request-' + $stateParams.number,
            state: 'all'
        }, function() {
            $scope.issue.value.forEach(function(c) {
                $HUB.call('issues', 'getComments', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    number: c.number
                }, function(err, com) {
                    c.fetchedComments = com;
                });
            });
        });

        //
        // Actions
        //

        $scope.createNewIssue = function() {
            $RPC.call('issue', 'add', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                title: $scope.newIssue.title,
                repo_uuid: $scope.repo.value.id,
                body: $scope.newIssue.body,
                number: $stateParams.number,
                sha: $scope.pull.value.head.sha,
                reference: $scope.selection
            }, function(err, issue) {
                $scope.newIssue.title = '';
                $scope.newIssue.body = '';
                $scope.showNewIssue = false;
                $scope.issue.value.unshift(issue.value);
            });
        };

        $scope.setCurrentIssue = function(issue) {
            if ($scope.currentIssue === issue || issue === null) {
                $scope.selection = null;
                if($scope.currentCommit == $scope.currentIssue.sha) {
                    $scope.compComm($scope.pull.value.base.sha, $scope.pull.value.head.sha);
                }
                $scope.currentIssue = null;
                return;
            }

            $scope.currentIssue = issue;
            if(!issue.hasOwnProperty('sha') || !issue.hasOwnProperty('fileReference')) {
                $scope.currentIssue = Issue.parse(issue);
            }
            if($scope.currentIssue.fileReference) {
                $scope.selection = $scope.currentIssue.fileReference;
            }
            $HUB.call('issues', 'getComments', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $scope.currentIssue.number
            }, function(err, data) {
                $scope.currentIssue.comments = data;
            });
        };

        $scope.comment = function() {
            $HUB.call('issues', 'createComment', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $scope.currentIssue.number,
                body: $scope.newCommentBody
            }, function(err, data) {
                var comment = data.value;
                $scope.currentIssue.comments.value.push(comment);
                $scope.newCommentBody = '';
            });
        };

        $scope.compComm = function(base, head) {
            $scope.currentCommit = base;

            $RPC.call('files', 'compare', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                base: base,
                head: head
            }, function(err, res) {
                console.log(res);
                if(!err) {
                    $scope.files.value = res.value.files;
                }
            });
        };

        $scope.close = function(index) {
            $HUB.call('issues', 'edit', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $scope.currentIssue.number,
                state: 'closed'
            }, function(err, issue) {
                $scope.setCurrentIssue(null);
                $scope.issue.value[index] = issue.value;
            });
        };

        $scope.merge = function() {
            $HUB.call('pullRequests', 'merge', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $stateParams.number
            }, function(err, res) {
                if (!err && res.value.merged) {
                    $scope.pull = $HUB.call('pullRequests', 'get', {
                        user: $stateParams.user,
                        repo: $stateParams.repo,
                        number: $stateParams.number
                    });
                }
            });
        };

        $scope.refreshStargazers = function() {
            $RPC.call('star', 'all', {
                repo: $scope.repo.value.id,
                comm: $scope.pull.value.head.sha
            }, function(err, stargazers) {
                $scope.stargazers = stargazers;
                $RPC.call('star', 'get', {
                    // repo uuid
                    repo: $scope.repo.value.id,
                    // comm uuid
                    comm: $scope.pull.value.head.sha
                }, function(err, data) {
                    $scope.starred = data.value !== '';
                });
            });
        };
        $scope.refreshStargazers();

        $scope.star = function() {
            $scope.vote = $RPC.call('star', 'set', {
                repo: $stateParams.repo,
                user: $stateParams.user,
                number: $stateParams.number,
                repo_uuid: $scope.repo.value.id,
                sha: $scope.pull.value.head.sha
            });
        };

        $scope.unstar = function() {
            $scope.vote = $RPC.call('star', 'rmv', {
                repo: $stateParams.repo,
                user: $stateParams.user,
                number: $stateParams.number,
                repo_uuid: $scope.repo.value.id,
                sha: $scope.pull.value.head.sha
            });
        };

        socket.on($stateParams.user + ':' + $stateParams.repo + ':pull-request-' + $stateParams.number + ':starred', function() {
            $scope.refreshStargazers();
        });

        socket.on($stateParams.user + ':' + $stateParams.repo + ':pull-request-' + $stateParams.number + ':unstarred', function() {
            $scope.refreshStargazers();
        });
    }
]);
