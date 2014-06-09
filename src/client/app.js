module = angular.module('app', ['ngRoute', 'ui.bootstrap', 'truncate', 'pluralize']);

// *************************************************************
// Delay start 
// *************************************************************

angular.element(document).ready(function() {
	angular.bootstrap(document, ['app']);
});

// *************************************************************
// Routes
// *************************************************************

module.config(['$routeProvider', '$locationProvider', function($route, $location) {

	$route.when('/', {
		templateUrl: '/templates/home.html',
		controller: 'HomeCtrl'
	});

	$route.when('/:user/:repo', {
		templateUrl: '/templates/repo.html',
		controller: 'RepoCtrl',
		resolve: {
			repo: ['$route', '$HUBService', function($route, $HUBService) {
				return $HUBService.call('repos', 'get', {
					user: $route.current.params.user,
					repo: $route.current.params.repo
				});
			}]
		}
	});

	$route.when('/:user/:repo/:sha', {
		templateUrl: '/templates/comm.html',
		controller: 'CommCtrl',
		resolve: {
			repo: ['$route', '$HUBService', function($route, $HUBService) {
				return $HUBService.call('repos', 'get', {
					user: $route.current.params.user,
					repo: $route.current.params.repo
				});
			}],

			comm: ['$route', '$HUBService', function($route, $HUBService) {
				return $HUBService.call('repos', 'getCommit', {
					user: $route.current.params.user,
					repo: $route.current.params.repo,
					sha: $route.current.params.sha
				});
			}]
		}
	});

	$route.otherwise({
		redirectTo: '/'
	});

	//$location.html5Mode(true);

}]);