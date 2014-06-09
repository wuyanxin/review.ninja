module.controller('HomeCtrl', ['$scope', '$routeParams', '$HUB', '$RPC', function($scope, $routeParams, $HUB, $RPC) {

	$scope.repo = $HUB.call("repos", "getAll");

}]);
