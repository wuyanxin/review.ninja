// *****************************************************
// Vote Directive
// *****************************************************

module.directive('vote', ['$HUB', '$RPC', function($HUB, $RPC) {
	return {
		restrict: 'E',
		templateUrl: '/directives/templates/vote.html',
		scope: {
			vote: '=value',
			issues: '=',
			comments: '='
		},
		link: function(scope, elem, attrs) {

			scope.avatar = scope.vote.user==='tool' ? '/assets/images/favicon-32.png' : null; // todo: default user icon

			if(scope.vote.user !== 'tool') {
				$HUB.call('user', 'getFrom', {
					user: scope.vote.name
				}, function(err, res) {
					if(!err) {
						scope.avatar = res.value.avatar_url;
					}
				});
			}
		}
	};
}]);