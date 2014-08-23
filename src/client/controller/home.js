// *****************************************************
// Home Controller
//
// tmpl: home.html
// path: /
// *****************************************************

module.controller('HomeCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$HUB', '$RPC',
    function($rootScope, $scope, $state, $stateParams, $HUB, $RPC) {

        $scope.repos = [];

        $scope.results = [];

        $RPC.call('user', 'get', {}, function(err, user) {
            if(!err) {
                user.value.repos.forEach(function(uuid) {
                    $RPC.call('repo', 'get', { repo_uuid: uuid }, function(err, repo) {
                        if(!err && repo.value.ninja) {
                            $scope.repos.push(repo.value);
                        }
                    });
                });
            }
        });

        $scope.orgs = $HUB.call('user', 'getOrgs', {

            //
            // NOTE:
            //  if ever a user has over 100 orgs
            //  we will have to address this problem
            //
            per_page: 100
        });

        $scope.teams = $HUB.call('user', 'getTeams', {});

        //
        // Actions
        //

        $scope.add = function(repo) {
            $RPC.call('repo', 'add', {
                user: repo.owner.login,
                repo: repo.name,
                repo_uuid: repo.id
            }, function(err, ninja) {
                if (!err) {
                    // should go to this repo
                    $state.go('repo.list', {user: repo.owner.login, repo:repo.name});
                }
            });
        };

        $scope.remove = function(repo) {

            $RPC.call('repo', 'rmv', {
                user: repo.owner.login,
                repo: repo.name,
                repo_uuid: repo.id
            }, function(err, ninja) {
                if (!err) {
                    repo.ninja = ninja.value.ninja;
                }
            });
        };

        $scope.searching = {};

        $scope.search = function() {

            if(!$scope.query.length) {
                $scope.results = [];
            }

            if($scope.query.length >= 3 && !$scope.searching.loading) {

                $scope.results = [];

                var query = $scope.query + '+in:name+user:' + $rootScope.user.value.login;

                $scope.orgs.value.forEach(function(org) {
                    query += '+user:' + org.login;
                });

                $scope.searching = $HUB.wrap('search', 'repos', {
                    q: query
                }, function(err, repos) {
                    if(!err && $scope.query.length >= 3) {
                        $scope.results = repos.value;
                    }
                });
            }
        };
    }
]);
