// *****************************************************
// Issue Factory
// *****************************************************

module.factory('Issue', function() {
    return {
        parse: function(issue) {
            // regex backup var regex = /\|commit\|file reference\|\r\n\|------\|--------------\|\r\n\|(\b[0-9a-f]{40}\b)\|\[(.*)?\].*?\|/;
            var regex = /\|commit\|file reference\|\r\n\|------\|--------------\|\r\n\|(\b[0-9a-f]{40}\b)\|(\[(.*)?\].*?|[`]none[`])\|/;
            var match = regex.exec(issue.body);
            console.log(issue.body);
            console.log(match);
            
            if(match) {
                issue.sha = match[1];
                issue.fileReference = match[3];
                issue.body = issue.body.replace(match[0], '');
            }

            return issue;
        },

        line: function(path, number) {
            return path + '#L' + number;
        }
    };
});
