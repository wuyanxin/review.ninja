module.controller('HomeCtrl', ['$scope', '$stateParams', '$HUB', '$RPC', function($scope, $stateParams, $HUB, $RPC) {

	$scope.repo = $HUB.call('repos', 'getAll');

}]);
