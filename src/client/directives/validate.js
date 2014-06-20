// *****************************************************
// Validate Directive
// *****************************************************

module.directive('validate', function () {
	return {
		restrict: 'E',
		templateUrl: '/directives/templates/validate.html',
		scope: {
			arg: '=',
			valid: '=',
			against: '=',
			validText: '@',
			vaildIcon: '@',
			invalidText: '@',
			invalidIcon: '@'
		},
		link: function (scope, element, attr) {

			scope.$watch('arg', function(newVal, oldVal) {

				scope.valid = true;
				
				for(var i=0; i<scope.against.length; i++) {
					if(scope.arg === scope.against[i]) {
						scope.valid = false;
					}
				}
			});
		}
	};
});