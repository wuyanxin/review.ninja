// *****************************************************
// Settings Controller
//
// tmpl: settings.html
// path: /:user/:repo/settings
// resolve: repo
// *****************************************************

module.controller('SettingsCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', '$modal', 'repo',
    function($scope, $stateParams, $HUB, $RPC, $modal, repo) {

        $scope.repo = repo;

        $scope.settings = $RPC.call('settings', 'get', {
            repo: repo.value.id
        });

        $scope.addBranchRegex = function() {
            $RPC.call('settings', 'addWatch', {
                repo: repo.value.id,
                watch: $scope.branchRegex
            }, function(err, settings) {
                if(!err) {
                    $scope.settings = settings;
                    $scope.branchRegex = '';
                    $scope.showAddNotification = false;
                }
            });
        };

        $scope.removeBranchRegex = function(regex) {
            $RPC.call('settings', 'removeWatch', {
                repo: repo.value.id,
                watch: regex
            }, function(err, settings) {
                if(!err) {
                    $scope.settings = settings;
                    $scope.branchRegex = '';
                }
            });
        };

        $scope.setNotifications = function() {
            $RPC.call('settings', 'setNotifications', {
                repo: repo.value.id,
                notifications: $scope.settings.value.notifications
            }, function(err, settings) {
                $scope.settings = settings;

            });
        };
    }]);
