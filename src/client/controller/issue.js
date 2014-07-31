// *****************************************************
// Pull Request Controller
//
// tmpl: pull.html
// path: /:user/:repo/pull/:number
// resolve: repo, pull 
// *****************************************************

module.controller('IssueCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', '$CommitCommentService', '$modal', 'repo', 'pull', 'issue',
    function($scope, $stateParams, $HUB, $RPC, $CommitCommentService, $modal, repo, pull, issue) {

        // get the repo
        $scope.repo = repo;

        // get the pull request
        $scope.pull = pull;

        // get the issue
        $scope.issue = Issue(issue);

        console.log($scope.issue);
        
        $scope.comments = $HUB.call('issues', 'getComments', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            number: $stateParams.issue
        });

        $scope.star = $RPC.call('star', 'all', {
            repo: $scope.repo.value.id,
            comm: $scope.pull.value.head.sha
        });

        // for the diff view
        // $scope.head = $scope.pull.value.head.sha;
        // $scope.base = $scope.pull.value.base.sha;

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

        $scope.files = $RPC.call('files', 'all', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            number: $stateParams.number
        });

        // get the tree (for the file browser)
        $scope.tree = $HUB.call('gitdata', 'getTree', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            sha: $scope.pull.value.head.sha
        });

        //
        // Actions
        //

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

        $scope.compComm = function(base, head) {
            $RPC.call('files', 'compare', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                base: base,
                head: head
            }, function(err, res) {
                if(!err) {
                    $scope.files.value = res.value.files;
                }
            });
        };

        $scope.comment = function() {
            $HUB.call('issues', 'createComment', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $stateParams.issue,
                body: $scope.newCommentBody
            }, function(err, data) {
                var comment = data.value;
                $scope.comments.value.push(comment);
                $scope.newCommentBody = '';
            });
        };
    }
]);
