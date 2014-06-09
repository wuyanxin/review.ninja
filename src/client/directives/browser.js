module.directive('browser', ['$routeParams', '$HUB', '$RPC', function($routeParams, $HUB, $RPC) {
	return {
		restrict: 'E',
		templateUrl: '/directives/templates/browser.html',
		scope: {
			data: '='
		},
		link: function(scope, elem, attrs) {

			scope.stack = [];

			scope.$watch('data.value', function(newVal, oldVal) {

				if(newVal) {
					scope.tree = scope.data.value;
				}
			});

			scope.up = function() {

				scope.file = null;

				var tree = scope.stack.pop();

				if(tree) {
					scope.data = $HUB.call('gitdata', 'getTree', {
						user: $routeParams.user,
						repo: $routeParams.repo,
						sha: tree.sha,
					});
				}
			};

			scope.down = function(node) {

				scope.stack.push(scope.tree);

				if(node.type == 'tree') {

					scope.data = $HUB.call('gitdata', 'getTree', {
						user: $routeParams.user,
						repo: $routeParams.repo,
						sha: node.sha,
					});
				}
				else if(node.type == 'blob') {

					scope.file = $RPC.call('comm', 'file', {
						user: $routeParams.user,
						repo: $routeParams.repo,
						sha: node.sha
					});
				}
			};
		}
	}
}]);