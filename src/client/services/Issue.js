// *****************************************************
// Issue Factory
// *****************************************************

module.factory('Issue', function() {

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
        }
    };
});
