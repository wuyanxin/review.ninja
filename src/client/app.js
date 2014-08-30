var module = angular.module('app', 
    ['ninja.filters', 
     'ninja.config',
     'ui.utils',
     'ui.router', 
     'ui.bootstrap',
     'infinite-scroll',
     'angulartics', 
     'angulartics.google.analytics']);

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

module.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$analyticsProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider, $analyticsProvider) {

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
            // Repo list state (list of pull requests)
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
                resolve: {
                    open: ['$HUBService', '$stateParams', 'Issue',
                        function($HUBService, $stateParams, Issue) {
                            return $HUBService.call('issues', 'repoIssues', {
                                user: $stateParams.user,
                                repo: $stateParams.repo,
                                labels: 'review.ninja, pull-request-' + $stateParams.number,
                                state: 'open'
                            }, function(err, open) {
                                if(!err) {
                                    open.affix.forEach(function(issue) {
                                        issue = Issue.parse(issue);
                                    });
                                }
                            });
                        }
                    ],
                    closed: ['$HUBService', '$stateParams', 'Issue',
                        function($HUBService, $stateParams, Issue) {
                            return $HUBService.call('issues', 'repoIssues', {
                                user: $stateParams.user,
                                repo: $stateParams.repo,
                                labels: 'review.ninja, pull-request-' + $stateParams.number,
                                state: 'closed'
                            }, function(err, closed) {
                                if(!err) {
                                    closed.affix.forEach(function(issue) {
                                        issue = Issue.parse(issue);
                                    });
                                }
                            });
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
                    issues: ['$stateParams', 'open', 'closed', function($stateParams, open, closed) {

                        if($stateParams.state === 'closed') {
                            return closed;
                        }

                        return open;
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
                    issue: ['$stateParams', '$HUBService', 'Issue',
                        function($stateParams, $HUBService, Issue) {
                            return $HUBService.call('issues', 'getRepoIssue', {
                                user: $stateParams.user,
                                repo: $stateParams.repo,
                                number: $stateParams.issue
                            }, function(err, issue) {
                                if(!err) {
                                    issue.value = Issue.parse(issue.value);
                                }
                            });
                        }
                    ]
                }
            });

        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode(true);

        $analyticsProvider.withAutoBase(true); // Records full path

    }
])
.run(['$config', '$rootScope', '$state', '$stateParams',
    function($config, $rootScope, $state, $stateParams) {

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $config.get(function(data, status) {
            if (data.gacode) {
                ga('create', data.gacode, 'auto');
            }
        });
    }
]);
