// *****************************************************
// Pull Factory
// *****************************************************

module.factory('Pull', ['$HUB', function($HUB) {

    return {

        issues: function(pull) {

            $HUB.call('issues', 'repoIssues', {
                user: pull.base.repo.owner.login,
                repo: pull.base.repo.name,
                labels: 'pull-request-' + pull.number,
                state: 'open',
                per_page: 1
            }, function(err, issues) {
                if(!err) {
                    pull.open_issue = issues.value.length ? issues.value[0] : null;
                }
            });

            $HUB.call('issues', 'repoIssues', {
                user: pull.base.repo.owner.login,
                repo: pull.base.repo.name,
                labels: 'pull-request-' + pull.number,
                state: 'closed',
                per_page: 1
            }, function(err, issues) {
                if(!err) {
                    pull.closed_issue = issues.value.length ? issues.value[0] : null;
                }
            });

            return pull;
        }
    };
}]);
