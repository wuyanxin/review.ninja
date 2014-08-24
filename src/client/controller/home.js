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

            var count = 0;
            var repos = user.value ? user.value.repos : [];

            $scope.checked = !repos.length ? true : false;

            repos.forEach(function(uuid) {
                $RPC.call('repo', 'get', { repo_uuid: uuid }, function(err, repo) {

                    // flag we have checked
                    if(++count === repos.length) {
                        $scope.checked = true;
                    }

                    if(!err && repo.value.ninja) {
                        $scope.checked = true;
                        $scope.repos.push(repo.value);
                    }
                });
            });
        });

        //
        // NOTE:
        //  if ever a user has over 100 orgs
        //  we will have to address this problem
        //
        $scope.orgs = $HUB.call('user', 'getOrgs', {
            per_page: 100
        });

        $scope.userRepos = $HUB.call('repos', 'getAll', {
            per_page: 100
        }, function(err, repos) {
            if(!err) {
                $scope.results = $scope.results.concat(repos.affix);
            }
        });

        //
        // Actions
        //

        $scope.add = function(repo) {
            $scope.adding = $RPC.call('repo', 'add', {
                user: repo.owner.login,
                repo: repo.name,
                repo_uuid: repo.id
            }, function(err, ninja) {
                if (!err) {
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

            if($scope.query.length >= 3 && !$scope.searching.loading) {

                var query = $scope.query + '+in:name+fork:true';

                $scope.orgs.value.forEach(function(org) {
                    query += '+user:' + org.login;
                });

                $scope.searching = $HUB.wrap('search', 'repos', {
                    q: query
                }, function(err, repos) {
                    if(!err && $scope.query.length >= 3) {
                        $scope.results = $scope.userRepos.value.concat(repos.value);
                    }
                });
            }
        };
    }
]);
