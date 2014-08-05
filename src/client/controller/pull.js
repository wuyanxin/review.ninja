// *****************************************************
// Pull Request Controller
//
// tmpl: pull.html
// path: /:user/:repo/pull/:number
// resolve: repo, pull 
// *****************************************************

module.controller('PullCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', '$CommitCommentService', '$modal', 'repo', 'pull',
    function($scope, $stateParams, $HUB, $RPC, $CommitCommentService, $modal, repo, pull) {

        // get the repo
        $scope.repo = repo;

        // get the pull request
        $scope.pull = pull;

        $scope.star = $RPC.call('star', 'all', {
            repo: $scope.repo.value.id,
            comm: $scope.pull.value.head.sha
        });

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
            labels: 'review.ninja,pull-request-' + $stateParams.number
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
                body: $scope.newIssue.body,
                number: $stateParams.number,
                sha: $scope.pull.value.head.sha,
                file_references: null
            }, function(data, err) {
                $scope.newIssue.title = '';
                $scope.newIssue.body = '';
                $scope.showNewIssue = false;
            });
        };

        $scope.setCurrentIssue = function(issue) {
            if ($scope.currentIssue === issue) {
                $scope.currentIssue = null;
                return;
            }
            $scope.currentIssue = issue;
        };

        $scope.commentOnIssue = function(issue) {
            $RPC.call('issues', 'add', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: issue.number,
                body: $scope.newCommentBody
            }, function(err, data) {
                var comment = data.value;
                $scope.currentIssue.fetchedComments.value.push(comment);
                $scope.newCommentBody = '';
            });
        };

        $scope.castStar = function() {
            $scope.vote = $RPC.call('star', 'set', {
                // repo uuid
                repo: $scope.repo.value.id,
                // comm uuid
                comm: $scope.pull.value.head.sha
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

    }
]);
