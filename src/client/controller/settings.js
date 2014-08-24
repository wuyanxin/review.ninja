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
            repo_uuid: repo.value.id
        });

        $scope.setWatched = function() {
            $RPC.call('settings', 'setWatched', {
                repo_uuid: repo.value.id,
                watched: $scope.settings.value.watched
            }, function(err, settings) {
                if(!err) {
                    $scope.settings = settings;
                }
            });
        };

        $scope.addWatched = function() {
            $scope.settings.value.watched.push($scope.newWatched);
            $scope.showAddNotification = false;
            $scope.newWatched = '';
            $scope.setWatched();
        };

        $scope.removeWatched = function(watched) {
            var index = $scope.settings.value.watched.indexOf(watched);
            $scope.settings.value.watched.splice(index, 1);
            $scope.setWatched();
        };

        $scope.setNotifications = function() {
            $RPC.call('settings', 'setNotifications', {
                repo_uuid: repo.value.id,
                notifications: $scope.settings.value.notifications
            }, function(err, settings) {
                if(!err) {
                    $scope.settings = settings;
                }
            });
        };
    }]);
