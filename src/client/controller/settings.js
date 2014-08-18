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
        $scope.settings = $RPC.call('conf', 'all', {
            repo: repo.value.id
        });
        $scope.bots = $RPC.call('tool', 'all', {
            repo: repo.value.id
        });
        $scope.origin = location.origin;

        $scope.addBot = function() {
            $RPC.call('tool', 'add', {
                name: $scope.botName,
                repo: $scope.repo.value.id
            }, function(err, bot) {
                if(!err) {
                    $scope.bots.value.push(bot.value);
                    $scope.botName = '';
                }
            });
        };

        $scope.removeBot = function(bot, index) {
            $RPC.call('tool', 'rmv', {
                id: bot._id
            }, function(err, bot) {
                if(!err) {
                    $scope.bots.value.splice(index, 1);
                }
            });
        };

        $scope.botSetEnabled = function(bot) {
            $RPC.call('tool', 'enable', {
                id: bot._id,
            }, function(err, bot) {
            });
            bot.enabled = true;
        };

        $scope.botSetDisabled = function(bot) {
            $RPC.call('tool', 'disable', {
                id: bot._id,
            }, function(err, bot) {
            });
            bot.enabled = false;
        };

        $scope.addBranchRegex = function() {
            $RPC.call('conf', 'addWatch', {
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

        $scope.setNotifications = function() {
            $RPC.call('conf', 'setNotifications', {
                repo: repo.value.id,
                notifications: $scope.settings.value.notifications
            }, function(err, settings) {
                $scope.settings = settings;
            });
        };
    }]);
