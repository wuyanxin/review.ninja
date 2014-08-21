// *****************************************************
// Reference Factory
// *****************************************************

module.factory('Reference', ['$state', '$stateParams', function($state, $stateParams) {

    var selected;

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

        clear: function() {
            references = {};
        },

        isIssue: function(ref) {

            if($state.current.name!=='repo.pull.issue.detail' && references[ref]) {
                return true;
            }
            
            if($state.current.name==='repo.pull.issue.detail' && contains(ref, parseInt($stateParams.issue, 10))) {
                return true;
            }

            return false;

        },

        isSelected: function(ref) {

            if(selected===ref) {
                return true;
            }

            return false;
        },

        selected: function() {
            return selected;
        },

        select: function(ref) {
            selected = selected !== ref ? ref : null;
        }
    };
}]);
