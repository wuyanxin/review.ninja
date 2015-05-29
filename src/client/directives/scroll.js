'use strict';
// *****************************************************
// Scroll Directive
// *****************************************************

module.directive('scroll', function($location) {
    return {
        restrict: 'A',
        scope: {
            scroll: '='
        },
        link: function(scope, element, attr) {
            element.click(function(e) {
                e.preventDefault();
                var dest = $('#' + scope.scroll.replace(/(:|\/|\.|\[|\]|,)/g, '\\$1'));
                if(dest && dest.offset()) {
                    $('html,body').animate({ scrollTop: dest.offset().top }, 1000, function() {
                        $location.hash(scope.scroll);
                    });
                }
            });
        }
    };
});
