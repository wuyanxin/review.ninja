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

        $scope.hasRepos = true;

        $RPC.call('user', 'get', {}, function(err, user) {
            if(!err) {

                $scope.hasRepos = !!user.value.repos.length;

                user.value.repos.forEach(function(uuid) {
                    $HUB.call('repos', 'one', {
                        id: uuid
                    }, function(err, repo) {
                        if(!err) {
                            repo.value.ninja = true;
                            $scope.repos.push(repo.value);
                        }
                    });
                });
            }
        });

        //
        // NOTE:
        //  if ever a user has over 100 orgs
        //  we will have to address this problem
        //
        $scope.orgs = $HUB.call('user', 'getOrgs', {
            per_page: 100
        });

        //
        // Actions
        //

        $scope.add = function(repo) {
            $scope.adding = $RPC.call('user', 'addRepo', {
                user: repo.owner.login,
                repo: repo.name,
                repo_uuid: repo.id
            }, function(err) {
                if (!err) {
                    $state.go('repo.list', {user: repo.owner.login, repo:repo.name});
                }
            });
        };

        $scope.remove = function(repo) {
            $RPC.call('user', 'rmvRepo', {
                user: repo.owner.login,
                repo: repo.name,
                repo_uuid: repo.id
            }, function(err) {
                if (!err) {
                    repo.ninja = false;
                }
            });
        };

        $scope.searching = {};

        $scope.search = function() {

            if(!$scope.query.length) {
                $scope.results = [];
            }

            if($scope.query.length >= 3 && !$scope.searching.loading) {

                var query = $scope.query + '+in:name+fork:true+user:' + $rootScope.user.value.login;

                $scope.orgs.value.forEach(function(org) {
                    query += '+user:' + org.login;
                });

                $scope.searching = $HUB.wrap('search', 'repos', {
                    q: query
                }, function(err, repos) {
                    if(!err && $scope.query.length) {
                        $scope.results = repos.value;
                    }
                });
            }
        };
    }
]);
