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
			}, function(err, status) {
				comm.status = status.value;
			});
		});
	});

	// get the pull requests (open and closed)
	$HUB.call('pullRequests', 'getAll', {
		user: $stateParams.user,
		repo: $stateParams.repo,
		state: 'open'
	}, function(err, open) {

		$HUB.call('pullRequests', 'getAll', {
			user: $stateParams.user,
			repo: $stateParams.repo,
			state: 'closed'
		}, function(err, closed) {
			
			$scope.pulls = (open.value || []).concat(closed.value || []);

			// get status of each pull request
			$scope.pulls.forEach(function(pull) {
				$RPC.call('vote', 'status', {
					repo: $scope.repo.value.id,
					comm: pull.head.sha
				}, function(err, status) {
					if(!err) {
						pull.status = status.value;
					}
				});
			});
		});
	});

	// get the bots
	var bots = [];	
	$scope.bots = $RPC.call('tool', 'all', {
		repo: $scope.repo.value.id
	}, function() {
		$scope.bots.value.forEach(function(bot) {
			bots.push(bot.name);
		});
	});


	//
	// Actions
	//

	$scope.addBot = function() {

		var addBotModal = $modal.open({
			templateUrl: '/templates/modals/bot.html',
			controller: 'AddBotCtrl',
			resolve: {
				bots: function() {
					return bots;
				}
			}
		});

		addBotModal.result.then(function(name) {
			$RPC.call('tool', 'add', {
				name: name,
				repo: $scope.repo.value.id
			}, function(err, bot) {
				if(!err) {
					$scope.bots.value.push(bot.value);
					bots.push(bot.value.name);
				}
			});
		});
	};

}]);

module.controller('AddBotCtrl', ['$scope', '$stateParams', '$modalInstance', 'bots', function($scope, $stateParams, $modalInstance, bots) {

	$scope.bots = bots;

	$scope.add = function(name) {
		$modalInstance.close(name);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
}]);
