// *****************************************************
// Login Controller
//
// tmpl: login.html
// path: /
// *****************************************************

module.controller('LoginCtrl', ['$scope', '$RPC', function($scope, $RPC) {

	//
	// Actions
	//

	$scope.subscribe = function() {

		$scope.call = $RPC.call('chimp', 'add', {
			email: $scope.email
		}, function() {
			$scope.email = null;
		});
	};

}]);
