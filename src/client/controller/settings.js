// *****************************************************
// Settings Controller
//
// tmpl: settings.html
// path: /:user/:repo/settings
// resolve: repo
// *****************************************************

module.controller('SettingsCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', '$modal', 'repo', 'settings', 'bots',
    function($scope, $stateParams, $HUB, $RPC, $modal, repo, settings, bots) {
        $scope.repo = repo;
        $scope.settings = settings;
        $scope.bots = bots;
        $scope.origin = location.origin;

        $scope.addBot = function() {
            $RPC.call('tool', 'add', {
                name: $scope.botName,
                repo: $scope.repo.value.id
            }, function(err, bots) {
                if(!err) {
                    $scope.bots = bots;
                    $scope.botName = '';
                }
            });
        };

        $scope.removeBot = function(bot) {
            $RPC.call('tool', 'rmv', {
                id: bot._id
            }, function(err, bot) {
                if(!err) {
                    $scope.bots = bots;
                }
            });
        };

        $scope.addBranchRegex = function() {
            $RPC.call('conf', 'addWatch', {
                repo: repo.value.id,
                watch: $scope.branchRegex
            }, function(err, settings) {
                if(!err) {
                    $scope.settings = settings;
                    $scope.branchRegex = '';
                }
            });
        };

        $scope.removeBranchRegex = function(regex) {
            $RPC.call('conf', 'removeWatch', {
                repo: repo.value.id,
                watch: regex
            }, function(err, settings) {
                if(!err) {
                    $scope.settings = settings;
                    $scope.branchRegex = '';
                }
            });
        };

        $scope.removeRepo = function() {
        };

        $scope.setNotifications = function() {
            $RPC.call('conf', 'setNotifications', {
                repo: repo.value.id,
                notifications: $scope.settings.value.notifications
            }, function(err, settings) {
                $scope.settings = settings;
            });
        };
    }]);
