module.controller('RepoCtrl', ['$scope', '$routeParams', '$HUB', '$RPC', 'repo', function($scope, $routeParams, $HUB, $RPC, repo) {

	// get the repo
	$scope.repo = repo;

	// get the branches
	$scope.branches = $HUB.call('repos', 'getBranches', {
		user:$routeParams.user, 
		repo:$routeParams.repo
	});

	// get the commits
	$scope.commits = $HUB.call('repos', 'getCommits', {
		user:$routeParams.user, 
		repo:$routeParams.repo
	});

	// get the pull requests
	$scope.pulls = $HUB.call('pullRequests', 'getAll', {
		user:$routeParams.user, 
		repo:$routeParams.repo
	});

}]);
