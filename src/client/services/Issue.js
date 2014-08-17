// *****************************************************
// Issue Factory
// *****************************************************

module.factory('Issue', ['reference', function(reference) {

    var regex = /\|commit\|file reference\|\r\n\|------\|--------------\|\r\n\|(\b[0-9a-f]{40}\b)\|(\[(.*)?\].*?|[`]none[`])\|/;

    return {

        parse: function(issue) {

            var match = regex.exec(issue.body);

            issue.body = match ? issue.body.replace(match[0], '').trim() : issue.body;

            if(match) {
                reference.type = 'issue';
                reference.sha = match[1];
                reference.ref = match[1] + '/' + match[3];
            }

            return issue;
        },

        clean: function(issue) {

            var match = regex.exec(issue.body);

            issue.body = match ? issue.body.replace(match[0], '').trim() : issue.body;

            return issue;
        }
    };
}]);
