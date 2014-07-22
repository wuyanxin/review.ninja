// *****************************************************
// Repository Controller
//
// tmpl: pull.html
// path: /:user/:repo
// resolve: repo 
// *****************************************************

module.controller('RepoCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', '$modal', 'repo', function($scope, $stateParams, $HUB, $RPC, $modal, repo) {

	// Filtering
	$scope.filters = {
		'pull_requests': {
			'user':  {
				filter: function (pulls, crit) {

					var regex = new RegExp(crit);

					// If no criteria is set, return all the objects
					if (crit == null) {
						return pulls;
					}

					var matched = [];

					pulls.forEach(function (pull) {
						if (regex.test(pull.user.login)) {
							matched.push(pull);
						}
					});

					return matched;
				},
				criteria: null
			},
			'branch': {
				filter: function (pulls, crit) {
					var regex = new RegExp(crit);

					// If no criteria is set, return all the objects
					if (crit == null) {
						return pulls;
					}

					var matched = [];

					pulls.forEach(function (pull) {
						if (regex.test(pull.head.ref)) {
							matched.push(pull);
						}
					});

					console.log(matched);

					return matched;
				},
				criteria: null
			},
			'status': {
				filter: function (data, crit) {
					// TODO
					return data;
				},
				criteria: null
			},
			'tag': {
				filter: function (data, crit) {
					// TODO
					return data;
				},
				criteria: null
			}
		},
		'commits': {
			'user': {
				filter: function (data, crit) {
					// TODO
					return data;
				},
				criteria: null
			},
			'branch': {
				filter: function (data, crit) {
					// TODO
					return data;
				},
				criteria: null
			},
			'status': {
				filter: function (data, crit) {
					// TODO
					return data;
				},
				criteria: null
			}
		}
	};

	$scope.setFilter = function (filter, crit) {
		// Set criteria for filter
		filter.criteria = crit;

		$scope.pullsFiltered = $scope.pulls;

		// Refilter 
		Object.keys($scope.filters['pull_requests']).forEach(function (filterName) {
			var filter = $scope.filters['pull_requests'][filterName];

			$scope.pullsFiltered = filter.filter($scope.pullsFiltered, filter.criteria);
		});

	};



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

			// Refilter 
			Object.keys($scope.filters['pull_requests']).forEach(function (filterName) {
				var filter = $scope.filters['pull_requests'][filterName];

				$scope.pullsFiltered = filter.filter($scope.pullsFiltered, filter.criteria);
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
