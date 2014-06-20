// *****************************************************
// Repository Controller
//
// tmpl: pull.html
// path: /:user/:repo
// resolve: repo 
// *****************************************************

module.controller('RepoCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', '$modal', 'repo', function($scope, $stateParams, $HUB, $RPC, $modal, repo) {

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
			// vote
			$RPC.call('vote', 'all', {
				repo: $scope.repo.value.id,
				comm: comm.sha
			}, function(err, vote) {
				comm.rnvotes = vote.value;
			});

			// approval
			$RPC.call('vote', 'status', {
				repo: $scope.repo.value.id,
				comm: comm.sha
			}, function(err, vote) {
				comm.rnstatus = vote.value;
			});
		});
	});

	// get the pull requests (open and closed)
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

			// get votes for each pull request
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


	//
	// Actions
	//

	$scope.addBot = function() {

		var addBotModal = $modal.open({
			templateUrl: '/templates/modals/bot.html',
			controller: 'AddBotCtrl'
		});

		addBotModal.result.then(function(name) {
			console.log(name);
		});
	};

}]);

module.controller('AddBotCtrl', ['$scope', '$stateParams', '$modalInstance', function($scope, $stateParams, $modalInstance) {

	$scope.add = function(name) {
		$modalInstance.close(name);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
}]);
