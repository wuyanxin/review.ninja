'use strict';
// *****************************************************
// File Directive
// *****************************************************

module.directive('file', ['$state', '$filter', '$stateParams', 'Reference', function($state, $filter, $stateParams, Reference) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/file.html',
            scope: {
                content: '='
            }
        };
    }
]);
