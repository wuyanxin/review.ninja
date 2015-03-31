'use strict';
// *****************************************************
// Graph Directive
// *****************************************************

module.directive('lineref', ['$stateParams', '$location', 'Reference',
    function($stateParams, $location, Reference) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/lineref.html',
            scope: {
                issue: '='
            },
            link: function(scope, elem, attrs) {
                var scrollLine = function(element) {
                    $location.hash('');
                    var link = element;
                    var anchor = element.attr('href');
                    var dest = $(anchor.replace(/(:|\.|\[|\]|,)/g, '\\$1'));
                    if(dest && dest.offset()) {
                        $location.hash(anchor);
                        $('html,body').animate({ scrollTop: dest.offset().top }, 300);
                    }
                };

                $('a[ng\-href^=#]').click(function(e) {
                    e.preventDefault();
                    scrollLine($(this));
                });

                if($stateParams.scroll) {
                    var element = $('a[ng\-href^=#]');
                    scrollLine(element);
                }

                scope.anchor = function() {
                    return Reference.anchor(scope.issue.sha, scope.issue.path, scope.issue.start);
                };
            }
        };
    }
]);
