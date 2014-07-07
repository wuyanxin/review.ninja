// *****************************************************
// Vote Directive
// *****************************************************

module.directive('vote', ['$HUB', '$RPC', function($HUB, $RPC) {
	return {
		restrict: 'E',
		templateUrl: '/directives/templates/vote.html',
		scope: {
			uuid: '=user',
			value: '=',
			issues: '=',
			comments: '='
		},
		link: function(scope, elem, attrs) {

			if( scope.uuid.match(/^tool\//) ) {
				scope.user = {
					value: {
						avatar_url: '/assets/images/favicon-32.png',
						login: scope.uuid.slice(5)
					}
				};
			}
			else {
				$RPC.call('user', 'get', {
					user: scope.uuid
				}, function(err, user) {
					if(!err) {
						scope.user = $HUB.call('user', 'getFrom', {
							user: user.value.name
						});
					}
				});
			}
		}
	};
}]);