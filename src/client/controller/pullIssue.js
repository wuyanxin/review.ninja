// *****************************************************
// Pull Issue Controller
//
// tmpl: pull/list.html
// path: /:user/:repo/pull/:number/:issue
// resolve: open, closed 
// *****************************************************

module.controller('PullIssueCtrl', ['$scope', '$state', '$stateParams', '$HUB', '$RPC', 'issue', 'socket',
    function($scope, $state, $stateParams, $HUB, $RPC, issue, socket) {


        // get the issue
        $scope.issue = issue.value;

        // switch the comparison view
        if($scope.issue.sha) {
            $scope.compComm($scope.issue.sha);
        }

        // get the comments
        $HUB.call('issues', 'getComments', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            number: $stateParams.issue
        }, function(err, comments) {
            if(!err) {
                $scope.issue.comments = comments;
            }
        });

        //
        // actions
        //

        $scope.toggle = function(issue) {

            var state = issue.state==='open' ? 'closed' : 'open';

            $HUB.call('issues', 'edit', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: issue.number,
                state: state
            }, function(err, issue) {
                if(!err) {
                    $scope.issue = Issue.parse(issue.value);
                    // todo: update reference
                }
            });
        };

        $scope.comment = function() {

            $HUB.call('issues', 'createComment', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $stateParams.issue,
                body: $scope.comment_text
            }, function(err, data) {

                if(!err) {
                    $scope.comment_text = '';
                }
            });
        };

        $scope.refreshComments = function(comment_id) {

                $HUB.call('issues', 'getComment', {
                    user: $stateParams.user,
                    repo: $stateParams.repo,
                    id: comment_id
                }, function(err, data) {

                    if(!err) {
                      $scope.issue.comments.value = $scope.issue.comments.value.concat(data.value);
                    }
                });
        };

        socket.on('new issue_comment for '+ $scope.issue.id, function(comment_id) {

            $scope.refreshComments(comment_id);
        });

    }
]);
