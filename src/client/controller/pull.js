module.controller('PullCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', 'repo', 'pull', function($scope, $stateParams, $HUB, $RPC, repo, pull) {

	// get the repo
	$scope.repo = repo;

	// get the pull request
	$scope.pull = pull;

	// get the commits
	$scope.commits = $HUB.call('pullRequests', 'getCommits', {
		user: $stateParams.user,
		repo: $stateParams.repo,
		number: $stateParams.number,
	});

	// get the files
	$scope.files = $HUB.call('pullRequests', 'getFiles', {
		user: $stateParams.user,
		repo: $stateParams.repo,
		number: $stateParams.number
	});

	$scope.tree = $HUB.call('gitdata', 'getTree', {
		user: $stateParams.user,
		repo: $stateParams.repo,
		sha: $scope.pull.value.head.sha
	});

	$scope.vote = $RPC.call('vote', 'get', {
		// repo uuid
		repo: $scope.repo.value.id,
		// comm uuid
		comm: $scope.pull.value.head.sha,
	});

	$scope.ninja = $RPC.call('comm', 'ninja', {
		user: $stateParams.user,
		repo: $stateParams.repo,
		comm: $scope.pull.value.head.sha
	}, function() {
		$scope.ninjaObject = JSON.parse($scope.ninja.value.content);
	});

	//
	// Actions
	//

	$scope.castVote = function(value) {
		$scope.vote = $RPC.call("vote", "set", {
			// repo uuid
			repo: $scope.repo.value.id,
			// comm uuid
			comm: $scope.pull.value.head.sha,
			// vote
			vote: value
		});
	};

}]);