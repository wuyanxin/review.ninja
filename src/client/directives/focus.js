// *****************************************************
// Focus Directive
//
// Stolen with love from:
// http://stackoverflow.com/questions/14833326/how-to-set-focus-in-angularjs
// *****************************************************

module.directive('focus', ['$timeout', '$parse', function($timeout, $parse) {
  return {
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focus);
      scope.$watch(model, function(value) {
        console.log('here', value);
        if(value === true) { 
          $timeout(function() {
            element[0].focus(); 
          });
        }
      });
    }
  };
}]);