'use strict';

module.controller('ReviewCtrl', ['$scope', '$state', '$stateParams', '$HUB', 'File',
    function($scope, $state, $stateParams, $HUB, File) {

        // compare the commits
        $scope.$emit('compareCommits', $HUB.wrap('repos', 'compareCommits', {
            user: $stateParams.user,
            repo: $stateParams.repo,
            base: $stateParams.base,
            head: $stateParams.head
        }, function(err, comp) {
            if(!err) {
                comp.value.files = File.getFileTypes(comp.value.files);
            }
        }));

    }
]);
