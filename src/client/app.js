module = angular.module('app', ['ui.router', 'ui.bootstrap', 'truncate', 'pluralize']);

// *************************************************************
// Delay start 
// *************************************************************

angular.element(document).ready(function() {
	angular.bootstrap(document, ['app']);
});

// *************************************************************
// Routes
// *************************************************************

module.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('home', {
			url:'/',
			templateUrl: '/templates/home.html',
			controller: 'HomeCtrl'
		})
		.state('repo', {
			url: '/:user/:repo',
			templateUrl: '/templates/repo.html',
			controller: 'RepoCtrl',
			resolve: {
				repo: ['$stateParams', '$HUBService', function($stateParams, $HUBService) {
					return $HUBService.call('repos', 'get', {
						user: $stateParams.user,
						repo: $stateParams.repo
					});
				}]
			}
		})
		.state('comm', {
			url: '/:user/:repo/:sha',
			templateUrl: '/templates/comm.html',
			controller: 'CommCtrl',
			resolve: {
				repo: ['$stateParams', '$HUBService', function($stateParams, $HUBService) {
					return $HUBService.call('repos', 'get', {
						user: $stateParams.user,
						repo: $stateParams.repo
					});
				}],

				comm: ['$stateParams', '$HUBService', function($stateParams, $HUBService) {
					return $HUBService.call('repos', 'getCommit', {
						user: $stateParams.user,
						repo: $stateParams.repo,
						sha: $stateParams.sha
					});
				}]
			}
		});

	$urlRouterProvider.otherwise('/');

	// $location.html5Mode(true);

}]);