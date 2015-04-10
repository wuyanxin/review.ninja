'use strict';
// settings test
describe('401 interceptor', function() {

    var scope, repo, httpBackend, createFactory;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.inject(function($injector) {
        createFactory = function() {
            var factory = $injector.get('401HttpResponseInterceptor');
            return factory;
        };
    }));

    // should have promise reject upon 401

    it('should do thing', function() {
        var factory = createFactory();
        console.log(factory);
    });

});
