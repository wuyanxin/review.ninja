module.directive('file', function() {
	return {
		restrict: 'E',
		templateUrl: '/directives/templates/file.html',
		scope: {
			content: '='
		},
		link: function(scope, elem, attrs) {

			scope.$watch('content', function(newVal, oldVal) {
				if(newVal) {
					scope.lines = scope.content.trim().replace(/\t/g, '    ').split('\n');
				}
			});
		}
	}
});