// *****************************************************
// Settings Controller
//
// tmpl: settings.html
// path: /:user/:repo/settings
// resolve: repo
// *****************************************************

module.controller('SettingsCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', '$modal', '$FilterSet', 'repo',
    function($scope, $stateParams, $HUB, $RPC, $modal, $FilterSet, repo) {
        $scope.repo = repo;

        $scope.addBot = function() {
            console.log("adding bot: " + $scope.botName);
        };

        $scope.addBranchRegex = function() {
            console.log("adding branch regex: " + $scope.branchRegex);
        };

        $scope.removeRepo = function() {
            console.log("removing repo: " + $scope.repo.value.full_name);
        };
    }]);
