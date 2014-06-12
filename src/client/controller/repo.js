module.controller('RepoCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', 'repo', function($scope, $stateParams, $HUB, $RPC, repo) {

	// get the repo
	$scope.repo = repo;

	// get the branches
	$scope.branches = $HUB.call('repos', 'getBranches', {
		user: $stateParams.user, 
		repo: $stateParams.repo
	});

	// get the commits
	$scope.commits = $HUB.call('repos', 'getCommits', {
		user: $stateParams.user,
		repo: $stateParams.repo
	}, function() {
		$scope.commits.value.forEach(function(comm) {
			$RPC.call("vote", "status", {
				repo: $scope.repo.value.id,
				comm: comm.sha
			}, function(err, vote) {
				comm.rnstatus = vote.value;
			});
		});
	});

	// get the pull requests
	$scope.openPulls = $HUB.call('pullRequests', 'getAll', {
		user: $stateParams.user, 
		repo: $stateParams.repo,
		state: 'open'
	}, function() {
		$scope.closedPulls = $HUB.call('pullRequests', 'getAll', {
			user: $stateParams.user, 
			repo: $stateParams.repo,
			state: 'closed'
		}, function() {
			var open = $scope.openPulls.value || [];
			var closed = $scope.closedPulls.value || [];

			$scope.pulls = open.concat(closed);

			$scope.pulls.forEach(function(pull) {
				$RPC.call('vote', 'all', {
					repo: $scope.repo.value.id,
					comm: pull.head.sha
				}, function(err, votes){
					pull.votes = votes.value || null;
				});
			});
		});
	});

}]);
