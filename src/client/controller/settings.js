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

        $scope.reposettings = $RPC.call('repo', 'get', {
            repo_uuid: repo.value.id
        });

        $scope.numberPattern = /[0-9]+/;

        var reposettingsCallback = function(err, reposettings) {
            if(!err) {
                $scope.reposettings.value = reposettings.value;
            }
        };

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

        $scope.addWatch = function() {
            var watched = $scope.settings.value.watched;
            watched.unshift($scope.newWatch);
            $scope.setWatched(watched);
        };

        $scope.removeWatch = function(watch) {
            var watched = $scope.settings.value.watched;
            watched.splice(watched.indexOf(watch), 1);
            $scope.setWatched(watched);
        };

        $scope.changeThreshold = function(invalid) {
            if(invalid) {
                $('#threshold').popover('show');
            } else {
                $('.popover').popover('hide');
            }

            $RPC.call('repo', 'setThreshold', {
                repo_uuid: repo.value.id,
                threshold: $scope.reposettings.value.threshold
            }, reposettingsCallback);
        };

        $scope.toggleComments = function() {
            $RPC.call('repo', 'setComment', {
                repo_uuid: repo.value.id,
                comment: $scope.reposettings.value.comment
            }, reposettingsCallback);
        };

        $scope.reset = function() {
            $scope.query = null;
        };
    }]);
