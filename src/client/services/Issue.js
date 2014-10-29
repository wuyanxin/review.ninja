// *****************************************************
// Issue Factory
// *****************************************************

module.factory('Issue', ['$stateParams', '$HUB', function($stateParams, $HUB) {

    var regex = /\|commit\|file reference\|.*\r\n\|-+\|-+\|.*\r\n\|(\b[0-9a-f]{40}\b)\|(\[([^\|]*)?\].*?|[`]none[`])\|.*/;

    return {

        parse: function(issue) {

            var match = regex.exec(issue.body);

            issue.body = match ? issue.body.replace(match[0], '').trim() : issue.body;

            if(match) {
                issue.sha = match[1];
                issue.ref = match[3];
            }

            return issue;
        },

        render: function(issue) {

            // NOTE:
            // in order to render, we need to fix this bug in node-github
            // (https://github.com/mikedeboer/node-github/issues/92)

            $HUB.wrap('markdown', 'render', {
                 text: issue.body,
                 mode: 'gfm',
                 context: $stateParams.user + '/' + $stateParams.repo
            }, function(err, res) {
                issue.body = res.value.body;
            });
            return issue;
        }
    };
}]);
