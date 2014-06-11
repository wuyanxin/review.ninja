module.controller('HomeCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', function($scope, $stateParams, $HUB, $RPC) {

	$scope.repos = [];

	$HUB.call('repos', 'getAll', {
		type: 'member'
	}, function(err, repos) {
		if(!err) {

			for(var i=0; i<repos.value.length; i++) {
				$RPC.call('repo', 'get', {
					user: repos.value[i].owner.login,
					repo: repos.value[i].name,
					uuid: repos.value[i].id
				}, function(err, repo) {
					if(!err) {
						$scope.repos.push(repo.value);
					}
				});
			}
		}
	});

	$scope.owned = $HUB.call('repos', 'getAll', {
		type:'owner'
	}, function(err, owned) {
		if(!err) {

			for(var i=0; i<$scope.owned.value.length; i++) {

				$scope.owned.value[i].enabled = false;

				$scope.owned.value[i].info = $RPC.call('repo', 'get', {
					user: $scope.owned.value[i].owner.login,
					repo: $scope.owned.value[i].name,
					uuid: $scope.owned.value[i].id
				}, function(err, repo) {
					if(!err) {
						$scope.repos.push(repo.value);

						for(var j=0; j<$scope.owned.value.length; j++) {
							if($scope.owned.value[j].id === repo.value.uuid) {
								$scope.owned.value[j].enabled = true;
							}
						}
					}					
				});
			}
		}
	});

	$scope.add = function(repo) {
		repo.info = $RPC.call('repo', 'add', {
			user: repo.owner.login,
			repo: repo.name,
			uuid: repo.id
		}, function(err, res) {
			repo.enabled = true;
		});
	};

	$scope.rmv = function(repo) {
		repo.info = $RPC.call('repo', 'rmv', {
			user: repo.owner.login,
			repo: repo.name,
			uuid: repo.id
		}, function(err, res) {
			repo.enabled = false;
		});
	};

}]);
