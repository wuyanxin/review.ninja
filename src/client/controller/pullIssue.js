// *****************************************************
// Pull Issue Controller
//
// tmpl: pull/list.html
// path: /:user/:repo/pull/:number/:issue
// resolve: open, closed 
// *****************************************************

module.controller('PullIssueCtrl', ['$scope', '$state', '$stateParams', '$HUB', '$RPC', 'issue',
    function($scope, $state, $stateParams, $HUB, $RPC, issue) {

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
