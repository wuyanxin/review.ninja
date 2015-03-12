'use strict';
module.controller('BadgeCtrl', ['$scope', '$modalInstance', '$stateParams', '$window',
    function($scope, $modalInstance, $stateParams, $window) {
        $scope.origin = $window.location.origin;

        $scope.formats = [
          {'id': 0, 'title': 'Image URL', 'link': $scope.origin + '/assets/images/wereviewninja-32.png'},
          {'id': 1, 'title': 'Markdown', 'link': '[![ReviewNinja](' + $scope.origin + '/assets/images/wereviewninja-32.png)](' + $scope.origin + '/' + $stateParams.user + '/' + $stateParams.repo + ')'},
          {'id': 2, 'title': 'Textile', 'link': '!' + $scope.origin + '/assets/images/wereviewninja-32.png:' + $scope.origin + '/' + $stateParams.user + '/' + $stateParams.repo},
          {'id': 3, 'title': 'RDoc', 'link': '{<img src=\"' + $scope.origin + '/assets/images/wereviewninja-32.png\" alt=\'ReviewNinja\' />}[' + $scope.origin + '/' + $stateParams.user + '/' + $stateParams.repo + ']'},
          {'id': 4, 'title': 'Asciidoc', 'link': 'image:' + $scope.origin + '/assets/images/wereviewninja-32.png[\'ReviewNinja\', link=\"' + $scope.origin + '/' + $stateParams.user + '/' + $stateParams.repo + '\"]'},
          {'id': 5, 'title': 'RST', 'link': '.. image::' + $scope.origin + '/assets/images/wereviewninja-32.png\n:target: ' + $scope.origin + '/' + $stateParams.user + '/' + $stateParams.repo},
          {'id': 6, 'title': 'Pod', 'link': '=for HTML <a href=\"' + $scope.origin + '/' + $stateParams.user + '/' + $stateParams.repo + '\"><img src=\"' + $scope.origin + '/assets/images/wereviewninja-32.png\"></a>'}
        ];

        $scope.update = function() {
          this.formatText = this.formats[this.selectedFormat].link;
        };

        $scope.ok = function() {
          $modalInstance.dismiss();
        };
    }
]);
