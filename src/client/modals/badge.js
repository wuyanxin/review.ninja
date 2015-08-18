'use strict';

module.controller('BadgeCtrl', ['$scope', '$modalInstance', '$stateParams', '$window', 'repo',
    function($scope, $modalInstance, $stateParams, $window, repo) {

        $scope.repo = repo;

        var origin = $window.location.origin;
        var link = origin + '/' + repo.value.id + '/badge';

        $scope.formats = [
          {'id': 0, 'title': 'Image URL', 'link': link},
          {'id': 1, 'title': 'Markdown', 'link': '[![ReviewNinja](' + link + ')](' + origin + '/' + $stateParams.user + '/' + $stateParams.repo + ')'},
          {'id': 2, 'title': 'Textile', 'link': '!' + link + ':' + origin + '/' + $stateParams.user + '/' + $stateParams.repo},
          {'id': 3, 'title': 'RDoc', 'link': '{<img src=\"' + link + '\" alt=\'ReviewNinja\' />}[' + origin + '/' + $stateParams.user + '/' + $stateParams.repo + ']'},
          {'id': 4, 'title': 'Asciidoc', 'link': 'image:' + link + '[\'ReviewNinja\', link=\"' + origin + '/' + $stateParams.user + '/' + $stateParams.repo + '\"]'},
          {'id': 5, 'title': 'RST', 'link': '.. image::' + link + '\n:target: ' + origin + '/' + $stateParams.user + '/' + $stateParams.repo},
          {'id': 6, 'title': 'Pod', 'link': '=for HTML <a href=\"' + origin + '/' + $stateParams.user + '/' + $stateParams.repo + '\"><img src=\"' + link + '\"></a>'}
        ];

        $scope.update = function() {
          this.formatText = this.formats[this.selectedFormat].link;
        };

        $scope.ok = function() {
          $modalInstance.dismiss();
        };
    }
]);
