module.controller('CommCtrl', ['$scope', '$routeParams', '$HUB', '$RPC', 'repo', 'comm', function($scope, $routeParams, $HUB, $RPC, repo, comm) {

	$scope.repo = repo;

	$scope.comm = comm;

	$scope.stat = $HUB.call('statuses', 'get', {
		user: $routeParams.user,
		repo: $routeParams.repo,
		sha: $routeParams.sha,
	});

	$scope.tree = $HUB.call('gitdata', 'getTree', {
		user: $routeParams.user,
		repo: $routeParams.repo,
		sha: $routeParams.sha,
	});

	$scope.vote = $RPC.call('vote', 'get', {
		// repo uuid
		repo: $scope.repo.value.id,
		// comm uuid
		comm: $routeParams.sha,
	});

	$scope.votes = $RPC.call('vote', 'all', {
		// repo uuid
		repo: $scope.repo.value.id,
		// comm uuid
		comm: $routeParams.sha,
	});

	$scope.issue = $HUB.call('issues', 'repoIssues', {
		user: $routeParams.user,
		repo: $routeParams.repo,
		state: "open",
		labels: "review.ninja"
	}, function() {
		$scope.issue.value.forEach(function(c) {
			$HUB.call('issues', 'getComments', {
				user: $routeParams.user,
				repo: $routeParams.repo,
				number: c.number
			}, function(err, com) {
				c.fetchedComments = com;
			});
		});
	});

	$scope.ninja = $RPC.call('comm', 'ninja', {
		user: $routeParams.user,
		repo: $routeParams.repo,
		comm: $routeParams.sha
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
			comm: $routeParams.sha,
			// vote
			vote: value
		});
	};

	$scope.compComm = function(commit) {
		$scope.comp = $HUB.call('repos', 'compareCommits', {
			user: $routeParams.user,
			repo: $routeParams.repo,
			// head sha
			head: $routeParams.sha,
			// base sha
			base: commit
		});
	};

	if($scope.comm.value.parents.length > 0) {
		$scope.compComm($scope.comm.value.parents[0].sha);
	}

}]);
