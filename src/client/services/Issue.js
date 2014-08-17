// *****************************************************
// Issue Factory
// *****************************************************

module.factory('Issue', function() {

    var sha, ref;

    var regex = /\|commit\|file reference\|\r\n\|------\|--------------\|\r\n\|(\b[0-9a-f]{40}\b)\|(\[(.*)?\].*?|[`]none[`])\|/;

    return {

        parse: function(issue) {

            var match = regex.exec(issue.body);

            issue.body = match ? issue.body.replace(match[0], '').trim() : issue.body;

            if(match) {
                sha = match[1];
                ref = match[1] + '/' + match[3];
            }

            return issue;
        },

        reference: function() {
            return { sha: sha, ref: ref, type: 'issue', disabled: true };
        }
    };
});
