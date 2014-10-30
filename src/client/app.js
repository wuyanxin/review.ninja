var module = angular.module('app',
    ['ninja.filters',
     'ui.utils',
     'ui.router',
     'ui.bootstrap',
     'infinite-scroll',
     'ngSanitize']);

var filters = angular.module('ninja.filters', []);

// *************************************************************
// Delay start
// *************************************************************

angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
});

// *************************************************************
// States
// *************************************************************

module.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {

        $stateProvider

            //
            // Home state
            //
            .state('home', {
                url: '/',
                templateUrl: '/templates/home.html',
                controller: 'HomeCtrl'
            })

            //
            // Repo state (abstract)
            //
            .state('repo', {
                abstract: true,
                url: '/:user/:repo',
                template: '<section ui-view></section>',
                resolve: {
                    repo: ['$rootScope', '$stateParams', '$HUBService',
                        function($rootScope, $stateParams, $HUBService) {
                            return $HUBService.call('repos', 'get', {
                                user: $stateParams.user,
                                repo: $stateParams.repo
                            }, function(err, repo) {
                                if(!err) {
                                    $rootScope.$emit('repos:get', repo.value);
                                }
                            });
                        }
                    ]
                }
            })

            //
            // Repo master state (list of pull requests)
            //
            .state('repo.master', {
                url: '',
                templateUrl: '/templates/repo/repo.html',
                controller: 'RepoCtrl',
                resolve: {
                    repo: ['repo', function(repo) {
                        return repo; // inherited from parent state
                    }]
                }
            })

            //
            // Repo settings state
            //
            .state('repo.settings', {
                url: '/settings',
                templateUrl: '/templates/repo/settings.html',
                controller: 'SettingsCtrl',
                resolve: {
                    repo: ['repo', function(repo) {
                        return repo; // inherited from parent state
                    }]
                }
            })

            //
            // Pull request state (abstract)
            //
            .state('repo.pull', {
                abstract: true,
                url: '/pull/:number',
                templateUrl: '/templates/pull/pull.html',
                controller: 'PullCtrl',
                resolve: {
                    repo: ['repo', function(repo) {
                        return repo; // inherited from parent state
                    }],
                    pull: ['$stateParams', '$HUBService',
                        function($stateParams, $HUBService) {
                            return $HUBService.wrap('pullRequests', 'get', {
                                user: $stateParams.user,
                                repo: $stateParams.repo,
                                number: $stateParams.number
                            });
                        }
                    ]
                }
            })

            //
            // Pull request issues state (abstract)
            //
            .state('repo.pull.issue', {
                abstract: true,
                url: '?state',
                templateUrl: '/templates/pull/sidebar.html',
                controller: 'SidebarCtrl',
                resolve: {
                    issues: ['$HUBService', '$stateParams', 'pull', 'Issue',
                        function($HUBService, $stateParams, pull, Issue) {
                            var milestone = pull.value.milestone;
                            return $HUBService.call('issues', 'repoIssues', {
                                user: $stateParams.user,
                                repo: $stateParams.repo,
                                state: $stateParams.state || 'open',
                                milestone: milestone ? milestone.number : null
                            }, function(err, issues) {
                                // ensure issues is initialized
                                issues.affix = issues.affix || [];
                                issues.value = issues.value || [];

                                if(!err) {
                                    issues.affix.forEach(function(issue) {
                                        issue = Issue.parse(issue);
                                    });
                                }
                            }, true);
                        }
                    ]
                }
            })

            //
            // Pull request issues state (list of issues)
            //
            .state('repo.pull.issue.master', {
                url: '?issues',
                templateUrl: '/templates/issue/list.html',
                controller: 'IssueListCtrl',
                resolve: {
                    issues: ['issues', function(issues) {
                        return issues;
                    }]
                }
            })

            //
            // Pull request issue state
            //
            .state('repo.pull.issue.detail', {
                url: '/:issue',
                templateUrl: '/templates/issue/detail.html',
                controller: 'IssueDetailCtrl',
                resolve: {
                    issue: ['$stateParams', 'issues',
                        function($stateParams, issues) {
                            var selected;
                            issues.value.forEach(function(issue) {
                                if(issue.number === parseInt($stateParams.issue)) {
                                    selected = issue;
                                }
                            });
                            return selected;
                        }
                    ]
                }
            });

        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode(true);

    }
])
.run(['$rootScope', '$state', '$stateParams',
    function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
]);
