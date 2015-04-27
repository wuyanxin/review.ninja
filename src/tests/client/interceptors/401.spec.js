'use strict';
// settings test
describe('401 interceptor', function() {
    var scope, repo, httpBackend, Interceptor;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module(function($provide) {
        var windowMock = {location: {href: '/thing'}};
        $provide.value('$window', windowMock);
    }));

    beforeEach(angular.mock.inject(function($injector, $location) {
        Interceptor = $injector.get('401HttpResponseInterceptor');
    }));

    it('should reject 401', function() {
        var fakeFail = {status: 401};
        (Interceptor.response(fakeFail)).should.be.rejected;
    });

    it('should reject other errors', function() {
        var fakeError = {status: 404};
        (Interceptor.responseError(fakeError)).should.be.rejected;
    });

    it('should pass and return response', function() {
        var fakeResponse = {status: 200};
        (Interceptor.response(fakeResponse)).should.be.eql(fakeResponse);
    });
});
