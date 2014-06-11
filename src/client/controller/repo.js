module.controller('RepoCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', 'repo', function($scope, $stateParams, $HUB, $RPC, repo) {

	console.log($stateParams);

	// get the repo
	$scope.repo = repo;

	// get the branches
	$scope.branches = $HUB.call('repos', 'getBranches', {
		user:$stateParams.user, 
		repo:$stateParams.repo
	});

	// get the commits
	$scope.commits = $HUB.call('repos', 'getCommits', {
		user:$stateParams.user, 
		repo:$stateParams.repo
	});

	// get the pull requests
	$scope.pulls = $HUB.call('pullRequests', 'getAll', {
		user:$stateParams.user, 
		repo:$stateParams.repo
	});

}]);
