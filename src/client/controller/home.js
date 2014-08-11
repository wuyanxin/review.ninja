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
        $HUB.call('repos', 'getAll', {}, function(err, repos) {
            repos.value.forEach(function(repo) {
                // get ninja repo
                $RPC.call('repo', 'get', {
                    user: repo.owner.login,
                    repo: repo.name,
                    uuid: repo.id
                }, function(err, ninja) {
                    repo.ninja = ninja.value || {
                        ninja: false
                    };
                    $scope.repos.push(repo);
                });
            });
        });

        // get user orgs
        $HUB.call('user', 'getOrgs', {}, function(err, orgs) {
            orgs.value.forEach(function(org) {
                $HUB.call('repos', 'getFromOrg', {
                    org: org.login
                }, function(err, repos) {
                    repos.value.forEach(function(repo) {
                        // get ninja repo
                        $RPC.call('repo', 'get', {
                            user: repo.owner.login,
                            repo: repo.name,
                            uuid: repo.id
                        }, function(err, ninja) {
                            repo.ninja = ninja.value || {
                                ninja: false
                            };
                            $scope.repos.push(repo);
                        });
                    });
                });
            });
        });

        //
        // Actions
        //

        $scope.toggle = function(repo) {

            var fn = repo.ninja.ninja ? 'rmv' : 'add';

            $RPC.call('repo', fn, {
                user: repo.owner.login,
                repo: repo.name,
                uuid: repo.id
            }, function(err, ninja) {

                // To Do:
                // - clear search input
                // - close modal
                // - probably need to make this a directive

                if (!err) {
                    repo.ninja = ninja.value;
                }
            });
        };

    }
]);
