// *****************************************************
// Reference Factory
// *****************************************************

// todo: replace with angular $emit, $broadcast, $on event emitters

module.factory('Reference', ['$state', '$stateParams', function($state, $stateParams) {

    var selected, activeIssue;

    var references = {};

    var contains = function(key, issue) {

        if(references[key]) {
            for(var i=0; i<references[key].length; i++) {
                if(references[key][i].issue === issue) {
                    return true;
                }
            }
        }

        return false;
    };

    return {

        get: function(ref) {
            return references[ref];
        },

        add: function(issue) {

            if(issue.sha && issue.ref) {
                var key = issue.sha + '/' + issue.ref;

                if(key === selected) {
                    selected = null;
                }

                if(!references[key]) {
                    references[key] = [];
                }

                if(!contains(key, issue.number)) {
                    references[key].push({ 
                        ref: issue.ref, 
                        sha: issue.sha, 
                        issue: issue.number 
                    });
                }
            }
        },

        set: function(issue) {
            activeIssue = issue;
        },

        active: function() {
            return activeIssue;
        },

        select: function(ref) {
            selected = selected !== ref ? ref : null;
        },

        clear: function() {
            activeIssue = null;
            references = {};
        },

        isIssue: function(ref) {

            if(references[ref]) {
                return true;
            }
            
            return false;
        },

        isSelected: function(ref) {

            if(selected===ref) {
                return true;
            }

            return false;
        }
    };
}]);
