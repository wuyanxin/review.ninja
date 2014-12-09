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

        $scope.setNotifications = function() {
            $RPC.call('settings', 'setNotifications', {
                repo_uuid: repo.value.id,
                notifications: $scope.settings.value.notifications
            }, function(err, settings) {
                if(!err) {
                    $scope.settings.value.notifications = settings.value.notifications;
                }
            });
        };

        $scope.setWatched = function(watched) {
            $RPC.call('settings', 'setWatched', {
                repo_uuid: repo.value.id,
                watched: watched
            }, function(err, settings) {
                if(!err) {
                    $scope.newWatch = '';
                    $scope.settings = settings;
                }
            });
        };

        $scope.addWatch = function(watch) {
            var watched = $scope.settings.value.watched;
            watched.unshift(watch);
            $scope.setWatched(watched);
        };

        $scope.removeWatch = function(watch) {
            var watched = $scope.settings.value.watched;
            watched.splice(watched.indexOf(watch), 1);
            $scope.setWatched(watched);
        };

        $scope.togglePullRequest = function() {
            $scope.settings.value.notifications.pull_request = !$scope.settings.value.notifications.pull_request;
            $scope.setNotifications();
        };

        $scope.toggleIssue = function() {
            $scope.settings.value.notifications.issue = !$scope.settings.value.notifications.issue;
            $scope.setNotifications();
        };

        $scope.toggleStar = function() {
            $scope.settings.value.notifications.star = !$scope.settings.value.notifications.star;
            $scope.setNotifications();
        };

        $scope.reset = function() {
            $scope.query = null;
        };
    }]);
