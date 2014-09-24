// *****************************************************
// In filter
// *****************************************************

filters.filter('in', function() {
    return function(items, array, attr) {

        if(!array || !array.length) {
            return items;
        }

        var matched = [];

        items.forEach(function(item) {

            var match = attr ? item[attr] : item;

            if(array.indexOf( match.toString() ) > -1) {
                matched.push(item);
            }
        });

        return matched;
    };
});
