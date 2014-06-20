
// validate test
describe('validate filter', function() {

	var scope;
	var validate;

	beforeEach(angular.mock.module('app'));

	beforeEach(angular.mock.inject(function ($injector, $rootScope, $compile) {
		scope = $rootScope.$new();
		validate = $injector.get('validate');
	}));

	it('should by true', function() {

		console.log(validate);

		should(true).ok;
	});

});