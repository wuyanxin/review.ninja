module.controller('PullCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', 'repo', 'pull', function($scope, $stateParams, $HUB, $RPC, repo, pull) {

	// get the repo
	$scope.repo = repo;

	// get the pull request
	$scope.pull = pull;

	// get the commits
	$scope.commits = $HUB.call('pullRequests', 'getCommits', {
		user: $stateParams.user,
		repo: $stateParams.repo,
		number: $stateParams.number
	});

	// get the files
	$scope.files = $HUB.call('pullRequests', 'getFiles', {
		user: $stateParams.user,
		repo: $stateParams.repo,
		number: $stateParams.number
	});

}]);