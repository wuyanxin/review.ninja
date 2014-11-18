// *****************************************************
// File Directive
// *****************************************************

module.directive('mergeButton', function() {
    return {
        restrict: 'E',
        templateUrl: '/directives/templates/merge.html',
        scope: {
            pull: '=',
            merge: '&',
            status: '=',
            merging: '='
        }
    };
});
