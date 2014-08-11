// *****************************************************
// Popover Directive
// *****************************************************

module.directive('popover', ['$stateParams', '$popover',
    function($stateParams, $popover) {
        return {
            restrict: 'A',
            scope: {
                args: '=',
                template: '@',
                placement: '@',
                container: '@'
            },
            link: function(scope, elem, attrs) {

                var popover = $popover(elem, {
                    content: {
                        args: scope.args,
                        exec: function(method) {
                            popover[method]();
                        }
                    },
                    template: scope.template,
                    placement: scope.placement,
                    container: scope.container
                });

                $('body').on('click', function(e) {

                    if( $(e.target).parents('.popover').length === 0 &&
                        $(e.target).parents('[popover]').length === 0 ) {

                        popover.hide();
                    }
                });
            }
        };
    }
]);
