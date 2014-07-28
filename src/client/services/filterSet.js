// *****************************************************
// Filter Factory
// *****************************************************
// Example usage:
//
// var filterSet = $FilterSet();
// var filterSet.define('issue', 'user', function (issues, criteria) {
//     var filteredIssues = [];
//     // filter by criteria
//     // ...
//     return filteredIssues;
// });
//
// var issues = ...; 
// var filteredIssues = filterSet.filter(issues, 'issue').by('user', 'Mitch').getResult();
//
module.factory('$FilterSet', function() {

    /**
     * Creates a new filter set
     */
    return function() {

        var filterSet = {};
        filterSet.filters = {};

        /**
         * Appends a filter function
         */
        filterSet.define = function(objType, criteriaType, filter) {

            if (!filterSet.filters[objType]) {
                filterSet.filters[objType] = {};
            }

            if (!filterSet.filters[objType][criteriaType]) {
                filterSet.filters[objType][criteriaType] = {};
            }

            filterSet.filters[objType][criteriaType].filter = filter;
            filterSet.filters[objType][criteriaType].criteria = null;
        };

        /**
         * Does the actual filtering
         */
        filterSet.filter = function(input, objType) {

            var by = function(critType, criteria) {

                by.objType = objType;

                // Apply criteria
                if (!filterSet.filters[by.objType][critType]) {
                    throw Error('Filter ' + by.objType + ' by ' + critType + ' does not exist. Did you forget to define it?');
                }

                filterSet.filters[by.objType][critType].criteria = criteria;

                by.input = input;

                by.by = by;

                by.getResult = function(done) {

                    var output = by.input;

                    Object.keys(filterSet.filters[by.objType]).forEach(function(criteriaType) {

                        var filter = filterSet.filters[by.objType][criteriaType];

                        if (filter.criteria !== null) {
                            output = filter.filter(output, filter.criteria);
                        }
                    });

                    done(output);
                };

                return by;
            };

            return {
                by: by
            };
        };

        return filterSet;
    };
});
