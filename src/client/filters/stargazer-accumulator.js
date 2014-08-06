filters.filter('stargazerAccumulator', function() {
    return function(stargazers) {

        var stargazerList = '';
        stargazers.forEach(function(stargazer) {
            stargazerList += '<span>' + stargazer.name + '</span><br />';
        });

        return stargazerList;
    };
});
