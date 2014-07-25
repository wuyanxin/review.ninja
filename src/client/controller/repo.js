// *****************************************************
// Repository Controller
//
// tmpl: pull.html
// path: /:user/:repo
// resolve: repo 
// *****************************************************

module.controller('RepoCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', '$modal', '$FilterSet', 'repo', function($scope, $stateParams, $HUB, $RPC, $modal, $FilterSet, repo) {

	// *********
	// FILTERING
	// *********

	$scope.selectedfilters = {
		branch: null,
		state: null,
		review_status: null,
	};

	$scope.selectFilter = function (critType, crit) {
		$scope.selectedfilters[critType] = crit;

		$scope.filterSet
			.filter($scope.pulls, 'pull_requests')
			.by('branch', $scope.selectedfilters.branch)
			.by('state', $scope.selectedfilters.state)
			.by('review_status', $scope.selectedfilters.review_status)
			.getResult(function (result) {
				$scope.pullsFiltered = result;
			});
	};

	$scope.resetFilters = function () {
		$scope.selectedfilters.branch = null;
		$scope.selectedfilters.state = null;
		$scope.selectedfilters.review_status = null;

		$scope.filterSet
			.filter($scope.pulls, 'pull_requests')
			.by('branch', $scope.selectedfilters.branch)
			.by('state', $scope.selectedfilters.state)
			.by('review_status', $scope.selectedfilters.review_status)
			.getResult(function (result) {
				$scope.pullsFiltered = result;
			});
	};

	if (!$scope.filterSet) {
		$scope.filterSet = $FilterSet();

		// Filter pull requests by branch
		$scope.filterSet.define('pull_requests', 'branch', function (pulls, crit) {
			var regex = new RegExp(crit);

			var matched = [];

			pulls.forEach(function (pull) {
				if (regex.test(pull.head.ref)) {
					matched.push(pull);
				}
			});

			return matched;
		});

		// Filter pull requests by state
		$scope.filterSet.define('pull_requests', 'state', function (pulls, crit) {
			var regex = new RegExp(crit);

			var matched = [];

			pulls.forEach(function (pull) {
				if (regex.test(pull.state)) {
					matched.push(pull);
				}
			});

			return matched;
		});

		// Filter pull requests by status
		$scope.filterSet.define('pull_requests', 'review_status', function (pulls, crit) {
			var regex = new RegExp(crit);

			var matched = [];

			pulls.forEach(function (pull) {
				if (regex.test(pull.status)) {
					matched.push(pull);
				}
			});

			return matched;
		});
	}


	$scope.pullRequestStates = ['open', 'closed'];
	$scope.reviewStatuses = ['approved', 'rejected', 'pending'];



	// get the repo
	$scope.repo = repo;

	$scope.origin = location.origin;

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


			$scope.pullsFiltered = $scope.pulls;

			$scope.filterSet
				.filter($scope.pullsFiltered, 'pull_requests')
				.by('branch', $scope.selectedfilters.branch)
				.by('state', $scope.selectedfilters.state)
				.by('review_status', $scope.selectedfilters.review_status)
				.getResult(function (result) {
					$scope.pullsFiltered = result;
				});
	

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
	$scope.botNames = [];

	$scope.bots = $RPC.call('tool', 'all', {
		repo: $scope.repo.value.id
	}, function() {
		$scope.bots.value.forEach(function(bot) {
			$scope.botNames.push(bot.name);
		});
	});


	//
	// Actions
	//

	$scope.addBot = function(name) {

		$RPC.call('tool', 'add', {
			name: name,
			repo: $scope.repo.value.id
		}, function(err, bot) {
			if(!err) {

				$scope.bots.value.push(bot.value);
				$scope.botNames.push(bot.value.name);

				var addBotModal = $modal.open({
					templateUrl: '/templates/modals/bot.html',
					controller: 'AddBotCtrl',
					resolve: {
						bot: function() {
							return bot.value;
						}
					}
				});
			}
		});
	};

}]);

module.controller('AddBotCtrl', ['$scope', '$stateParams', '$modalInstance', 'bot', function($scope, $stateParams, $modalInstance, bot) {

	$scope.bot = bot;

	$scope.origin = location.origin;

	$scope.done = function() {
		$modalInstance.dismiss('cancel');
	};
}]);
