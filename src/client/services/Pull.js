// *****************************************************
// Pull Factory
// *****************************************************

module.factory('Pull', ['$HUB', '$stateParams', function($HUB, $stateParams) {

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
        },

        render: function(pull) {

            if(pull.body) {
                $HUB.wrap('markdown', 'render', {
                    text: pull.body,
                    mode: 'gfm',
                    context: $stateParams.user + '/' + $stateParams.repo
                }, function(err, markdown) {
                    if(!err) {
                        pull.html = markdown.value.body;
                    }
                });
            }

            return pull;
        }
    };
}]);
