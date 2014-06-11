module.controller('PullCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', 'repo', 'pull', function($scope, $stateParams, $HUB, $RPC, repo, pull) {

	// get the repo
	$scope.repo = repo;

	// get the pull request
	$scope.pull = pull;

}]);