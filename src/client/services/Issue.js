// *****************************************************
// Issue Factory
// *****************************************************

module.factory('Issue', function() {
    return {
        parse: function(issue) {
            var sha = /^--- Pull Request #\d*? on commit (\b[0-9a-f]{40}\b) ---/;

            var match = sha.exec(issue.body);

            issue.sha = null;
            
            if(match) {
                issue.sha = match[1];
                issue.body = issue.body.replace(match[0], '');
            }

            return issue;
        },

        line: function(sha, path, number) {
            return '/blob/' + sha + '/' + path + '#L' + number;
        }
    };
});
