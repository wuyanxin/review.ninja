/**
 * Angular pluralize directive
 *
 * example:
 * {{ 1 | pluralize:'guy' }} -> 1 guy
 * {{ 3 | pluralize:'guy' }} -> 3 guys
 **/

angular.module('pluralize', [])
	.filter('pluralize', function(){
		return function(input, word) {

			if( input != 1 ) {
				word = word + 's';
			}

			return input + ' ' + word;
		};
	});