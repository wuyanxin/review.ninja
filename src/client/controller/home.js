// *****************************************************
// Home Controller
//
// tmpl: home.html
// path: /
// *****************************************************

module.controller('HomeCtrl', ['$scope', '$stateParams', '$HUB', '$RPC',
    function($scope, $stateParams, $HUB, $RPC) {

        $scope.repos = [];

        // TO DO:
        // - think about pagination
        // - how to display loading

        // get all user repos

        $scope.user = $HUB.call('user', 'get', {}, function(err, user) {
            $scope.currentImage = user.value.avatar_url;
            $scope.currentName = user.value.name;
            $scope.currentLogin = user.value.login;
            $scope.loadUserRepos(user.value);
        });

        $scope.orgs = $HUB.call('user', 'getOrgs');

        $scope.loadOrgRepos = function(org) {
            $scope.currentImage = org.avatar_url;
            $HUB.call('repos', 'getFromOrg', {
                org: org.login
            }, function(err, repos) {
                $scope.refreshRepos(repos);
            });
        };

        $scope.loadUserRepos = function(user) {
            $scope.currentImage = user.avatar_url;
            $HUB.call('repos', 'getAll', {}, function(err, repos) {
                $scope.refreshRepos(repos);
            });
        };

        $scope.refreshRepos = function(repos) {
            $scope.enabledRepos = [];
            repos.value.forEach(function(repo) {
                // get ninja repo
                $HUB.wrap('repos', 'one', {
                    id: repo.id
                }, function(err, ninja) {
                    repo.ninja = ninja.value || {
                        ninja: false
                    };
                    $scope.enabledRepos.push(repo);
                });
            });
        };

        //
        // Actions
        //

        $scope.addRepo = function(repo) {
            $RPC.call('repo', 'add', {
                user: repo.owner.login,
                repo: repo.name,
                uuid: repo.id
            }, function(err, ninja) {
                if (!err) {
                    repo.ninja = ninja.value;
                    if(repo.owner.type === 'Organization') {
                        $scope.loadOrgRepos(repo.owner);
                    }
                    if(repo.owner.type === 'User') {
                        $scope.loadUserRepos(repo.owner);
                    }
                }
            });
        };

        $scope.removeRepo = function(repo) {
            $RPC.call('repo', 'rmv', {
                user: repo.owner.login,
                repo: repo.name,
                uuid: repo.id
            }, function(err, ninja) {
                if (!err) {
                    repo.ninja = ninja.value;
                }
            });
        };

        $scope.searchRepo = function() {
            if($scope.search.length >= 3) {
                var userQuery = 'user:'+$scope.user.value.login;
                $scope.orgs.value.forEach(function(org) {
                    userQuery += '+user:'+org.login;
                });
                $HUB.call('search', 'repos', {
                    q: $scope.search+'+in:name+'+userQuery
                }, function(err, repos) {
                    $scope.repos = repos.value.items;
                });
            }
        };
    }
]);
