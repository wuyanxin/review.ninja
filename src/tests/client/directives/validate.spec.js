
// validate test
describe('Validate Directive', function() {

	var scope;
	var compile;
	var validate;

	beforeEach(angular.mock.module('app'));

	beforeEach(angular.mock.module('templates'));

	beforeEach(angular.mock.inject(function ($injector, $rootScope, $compile, $httpBackend) {
		scope = $rootScope.$new();
		compile = $compile;

    $httpBackend.when('GET', '/config').respond({
      data: {
        gacode: 'google-analytics-code'
      }
    });
	}));

	// should be valid
	it('should be valid', function() {

		scope.arg = 'john';
		scope.against = ['david', 'elizabeth', 'ian', 'lauren', 'jackie'];

		var element = compile('<validate arg="arg" against="against" valid="valid"></validate>')(scope);

		scope.$digest();

		scope.valid.should.be.exactly(true);
	});

	// should be invalid
	it('should be invalid', function() {

		scope.arg = 'david';
		scope.against = ['david', 'elizabeth', 'ian', 'lauren', 'jackie'];

		var element = compile('<validate arg="arg" against="against" valid="valid"></validate>')(scope);

		scope.$digest();

		scope.valid.should.be.exactly(false);
	});

	// should be valid with empty array
	it('should be valid with edge cases', function() {

		var element;

		scope.arg = 'john';

		element = compile('<validate arg="arg" against="[]" valid="valid"></validate>')(scope);
		scope.$digest();

		scope.valid.should.be.exactly(true);

		element = compile('<validate arg="arg" valid="valid"></validate>')(scope);
		scope.$digest();

		scope.valid.should.be.exactly(true);
	});

});
