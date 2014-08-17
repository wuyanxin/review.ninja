// *****************************************************
// Pull Issue Controller
//
// tmpl: pull/list.html
// path: /:user/:repo/pull/:number/:issue
// resolve: open, closed 
// *****************************************************

module.controller('PullIssueCtrl', ['$scope', '$state', '$stateParams', '$HUB', '$RPC', 'issue', 'Issue',
    function($scope, $state, $stateParams, $HUB, $RPC, issue, Issue) {

        // get the issue
        $scope.issue = Issue.parse(issue.value);

        // get the comments
        $HUB.call('issues', 'getComments', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            number: $stateParams.issue
        }, function(err, comments) {
            $scope.issue.comments = comments.value;
        });

        // update the comparison view
        if($scope.reference.type==='issue' && $scope.reference.sha) {
            $scope.compComm($scope.reference.sha);
        }

        //
        // actions
        //

        $scope.toggle = function(issue) {

            var state = issue.state==='open' ? 'closed' : 'open';

            $HUB.call('issues', 'edit', {
                user: $stateParams.user,
                repo: $stateParams.repo,
                number: $stateParams.issue,
                state: state
            }, function(err, issue) {
                if(!err) {
                    $scope.issue = Issue.parse(issue.value);
                }
            });
        };

        // $scope.comment = function() {
        //     $HUB.call('issues', 'createComment', {
        //         user: $stateParams.user,
        //         repo: $stateParams.repo,
        //         number: $scope.currentIssue.number,
        //         body: $scope.newCommentBody
        //     }, function(err, data) {
        //         var comment = data.value;
        //         $scope.currentIssue.comments.value.push(comment);
        //         $scope.newCommentBody = '';
        //     });
        // };
    }
]);
