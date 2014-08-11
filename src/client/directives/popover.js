// *****************************************************
// Popover Directive
// *****************************************************

module.directive('customPopover', [
    function() {
        return {
            restrict: 'A',
            link: function (scope, el, attrs) {
                $(el).popover({
                    trigger: 'click',
                    html: true,
                    content: '<span class="default-font">'+attrs.popoverHtml+'</span>',
                    placement: attrs.popoverPlacement,
                    title: attrs.popoverTitle
                });
            }
        };
    }
]);
