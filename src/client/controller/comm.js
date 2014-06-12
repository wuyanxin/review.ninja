module.controller('CommCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', 'repo', 'comm', function($scope, $stateParams, $HUB, $RPC, repo, comm) {

	$scope.repo = repo;

	$scope.comm = comm;

	$scope.stat = $HUB.call('statuses', 'get', {
		user: $stateParams.user,
		repo: $stateParams.repo,
		sha: $stateParams.sha,
	});

	$scope.tree = $HUB.call('gitdata', 'getTree', {
		user: $stateParams.user,
		repo: $stateParams.repo,
		sha: $stateParams.sha,
	});

	$scope.vote = $RPC.call('vote', 'get', {
		// repo uuid
		repo: $scope.repo.value.id,
		// comm uuid
		comm: $stateParams.sha,
	});

	$scope.votes = $RPC.call('vote', 'all', {
		// repo uuid
		repo: $scope.repo.value.id,
		// comm uuid
		comm: $stateParams.sha,
	});

	$scope.comments = $HUB.call('repos', 'getCommitComments', {
		user: $stateParams.user,
		repo: $stateParams.repo,
		sha: $stateParams.sha
	}, function() {
		$scope.comments.value.forEach(function(comment) {

			// we need to match these comments to files
			for(var i=0; i<$scope.comm.value.files.length; i++) {
				if(comment.path === $scope.comm.value.files[i].filename) {
					if(!$scope.comm.value.files[i].comments) {
						$scope.comm.value.files[i].comments = {};
					}
					if(!$scope.comm.value.files[i].comments[comment.position]) {
						$scope.comm.value.files[i].comments[comment.position] = [];
					}
					$scope.comm.value.files[i].comments[comment.position].push(comment);
				}
			}
		});
	});

	$scope.issue = $HUB.call('issues', 'repoIssues', {
		user: $stateParams.user,
		repo: $stateParams.repo,
		state: "open",
		labels: "review.ninja"
	}, function() {
		$scope.issue.value.forEach(function(c) {
			$HUB.call('issues', 'getComments', {
				user: $stateParams.user,
				repo: $stateParams.repo,
				number: c.number
			}, function(err, com) {
				c.fetchedComments = com;
			});
		});
	});

	$scope.ninja = $RPC.call('comm', 'get', {
		uuid: $scope.repo.value.id,
		user: $stateParams.user,
		repo: $stateParams.repo,
		comm: $stateParams.sha
	}, function() {
		$scope.ninja.value.config = JSON.parse($scope.ninja.value.ninja);
	});

	//
	// Actions
	//

	$scope.castVote = function(value) {
		$scope.vote = $RPC.call("vote", "set", {
			// repo uuid
			repo: $scope.repo.value.id,
			// comm uuid
			comm: $stateParams.sha,
			// vote
			vote: value
		});
	};

	// $scope.compComm = function(commit) {
	// 	$scope.comp = $HUB.call('repos', 'compareCommits', {
	// 		user: $stateParams.user,
	// 		repo: $stateParams.repo,
	// 		// head sha
	// 		head: $stateParams.sha,
	// 		// base sha
	// 		base: commit
	// 	});
	// };

	// if($scope.comm.value.parents.length > 0) {
	// 	$scope.compComm($scope.comm.value.parents[0].sha);
	// }

}]);
