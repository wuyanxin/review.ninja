'use strict';

// *****************************************************
// Add Repo Directive
// *****************************************************

module.directive('addRepoOld', ['$stateParams', '$HUB', '$RPC',
    function($stateParams, $HUB, $RPC, File) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/addRepoOld.html',
            scope: {
                repos: '=',
                show: '=',
                setFocus: '='
            },
            link: function(scope, elem, attrs) {

                scope.results = [];

                //
                // Actions
                //

                scope.add = function(repo) {
                    $RPC.call('user', 'addRepo', {
                        user: repo.owner.login,
                        repo: repo.name,
                        repo_uuid: repo.id
                    }, function(err) {
                        scope.active = null;
                        if(!err) {
                            repo.adddate = -new Date();
                            scope.repos.push(repo);
                            scope.show = false;
                            scope.reset();
                        }
                    });
                };

                scope.search = function() {

                    // clear results
                    scope.results = [];

                    // get query
                    var query = scope.query.split('/');
                    query = (query[1] || '') + '+in:name+fork:true+user:' + query[0];

                    scope.searching = $HUB.wrap('search', 'repos', {
                        q: query
                    }, function(err, repos) {
                        if(!err) {
                            scope.results = repos.value;
                        }
                    });
                };

                scope.reset = function() {
                    scope.query = null;
                    scope.results = [];
                };

            }
        };
    }
]);
