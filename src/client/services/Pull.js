// *****************************************************
// Pull Factory
// *****************************************************

module.factory('Pull', ['$HUB', function($HUB) {

    return {

        milestone: function(pull) {

            if(pull.milestone) {
                $HUB.call('issues', 'getMilestone', {
                    user: pull.base.repo.owner.login,
                    repo: pull.base.repo.name,
                    number: pull.milestone.number
                }, function(err, milestone) {
                    if(!err) {
                        pull.milestone = milestone.value;
                    }
                });
            }

            return pull;
        }
    };
}]);
