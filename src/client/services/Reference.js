// *****************************************************
// Reference Factory
// *****************************************************

module.factory('Reference', function() {

    var selected;
    var references = {};

    return {

        get: function() {
            return references;
        },

        add: function(issue) {

            if(issue.sha && issue.ref) {
                var key = issue.sha + '/' + issue.ref;

                if(key === selected) {
                    selected = null;
                }

                references[key] = { 
                    ref: issue.ref, 
                    sha: issue.sha, 
                    issue: issue.number 
                };
            }
        },

        selected: function() {
            return selected;
        },

        select: function(ref) {
            selected = selected !== ref ? ref : null;
        }
    };
});
