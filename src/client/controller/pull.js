// *****************************************************
// Pull Request Controller
//
// tmpl: pull.html
// path: /:user/:repo/pull/:number
// resolve: repo, pull 
// *****************************************************

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

	// get the files (for the diff)
	$scope.files = $HUB.call('pullRequests', 'getFiles', {
		user: $stateParams.user,
		repo: $stateParams.repo,
		number: $stateParams.number
	});

	// get the tree (for the file browser)
	$scope.tree = $HUB.call('gitdata', 'getTree', {
		user: $stateParams.user,
		repo: $stateParams.repo,
		sha: $scope.pull.value.head.sha
	});

	// ger your vote
	$scope.vote = $RPC.call('vote', 'get', {
		// repo uuid
		repo: $scope.repo.value.id,
		// comm uuid
		comm: $scope.pull.value.head.sha,
	});

	// get the ninja config file
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
		$scope.vote = $RPC.call('vote', 'set', {
			// repo uuid
			repo: $scope.repo.value.id,
			// comm uuid
			comm: $scope.pull.value.head.sha,
			// vote
			vote: value
		});
	};

}]);