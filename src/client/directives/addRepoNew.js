'use strict';

// *****************************************************
// Add Repo Directive
// *****************************************************

module.directive('addRepoNew', ['$stateParams', '$HUB', '$RPC',
    function($stateParams, $HUB, $RPC, File) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/addRepoNew.html',
            scope: {
                repos: '=',
                show: '=',
                setFocus: '=',
                add: '&'
            },
            link: function(scope, elem, attrs) {

                scope.allRepos = $HUB.call('repos', 'getAll', {
                    headers: {accept: 'application/vnd.github.moondragon+json'},
                    per_page: 50
                });

                //
                // Actions
                //

                scope.addRepo = function(repo) {
                    scope.add(repo, function(err) {
                        scope.active = null;
                        if(!err) {
                            repo.adddate = -new Date();
                            scope.repos.push(repo);

                            scope.search = '';
                            scope.show = false;
                        }
                    });
                };

                scope.contains = function(id) {
                    var contains = false;
                    scope.repos.forEach(function(repo) {
                        contains = contains || repo.id === id;
                    });

                    return contains;
                };
            }
        };
    }
]);
