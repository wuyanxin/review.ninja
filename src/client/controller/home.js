module.controller('HomeCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', function($scope, $stateParams, $HUB, $RPC) {

	$scope.user = $HUB.call('user', 'get');

	$scope.repos = $HUB.call('repos', 'getAll', {
		type: 'all'
	}, function(err, repos) {
		if(!err) {
			for(var i=0; i<repos.value.length; i++) {
				repos.value[i].ninja = $RPC.call('repo', 'get', {
					user: repos.value[i].owner.login,
					repo: repos.value[i].name,
					uuid: repos.value[i].id
				});
			}
		}
	});

	$scope.add = function(repo) {
		repo.ninja = $RPC.call('repo', 'add', {
			user: repo.owner.login,
			repo: repo.name,
			uuid: repo.id
		});
	};

	$scope.rmv = function(repo) {
		repo.ninja = $RPC.call('repo', 'rmv', {
			user: repo.owner.login,
			repo: repo.name,
			uuid: repo.id
		});
	};

}]);
