'use strict';
// *****************************************************
// Home Controller
//
// tmpl: home.html
// path: /
// *****************************************************

module.controller('HomeCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$modal', '$HUB', '$RPC',
    function($rootScope, $scope, $state, $stateParams, $modal, $HUB, $RPC) {

        $scope.repos = [];

        $rootScope.promise.then(function(user) {
            var count = 0;
            var repos = user ? user.value.repos : [];

            $scope.loaded = count === repos.length;

            $scope.show = $stateParams.addrepo || ($scope.loaded && user.value.history.welcome);

            repos.forEach(function(uuid) {
                $HUB.call('repos', 'one', {
                    id: uuid
                }, function(err, repo) {
                    $scope.loaded = ++count === repos.length;
                    if(!err) {
                        $scope.repos.push(repo.value);
                    }
                });
            });
        });

        //
        // Actions
        //

        $scope.add = function(repo, done) {
            $RPC.call('user', 'addRepo', {
                user: repo.owner.login,
                repo: repo.name,
                repo_uuid: repo.id
            }, done);
        };

        $scope.rmv = function(repo) {
            if(repo.permissions.admin) {
                $scope.active = $scope.active !== repo ? repo : null;
            } else {
                $scope.remove(repo);
            }
        };

        $scope.remove = function(repo) {
            var index = $scope.repos.indexOf(repo);
            $RPC.call('user', 'rmvRepo', {
                user: repo.owner.login,
                repo: repo.name,
                repo_uuid: repo.id
            }, function(err) {
                if(!err) {
                    $scope.repos.splice(index, 1);
                    $scope.active = null;
                }
            });
        };

        $scope.removeWebhook = function(repo) {
            $scope.webhook = $RPC.call('webhook', 'remove', {
                user: repo.owner.login,
                repo: repo.name
            }, function(err) {
                if(!err) {
                    $scope.remove(repo);
                }
            });
        };

        $scope.createOnboardingRepo = function() {
            $scope.repoLoading = $RPC.call('onboard', 'createrepo', {}, function(err, repo) {
                if (!err) {
                    $scope.add(repo.value, function(err) {
                        if (!err) {
                            var repoToAdd = repo.value;
                            repoToAdd.adddate = -new Date();
                            $scope.repos.push(repoToAdd);
                        }
                    });
                    $rootScope.dismiss('welcome');
                }
            });
        };
    }
]);
