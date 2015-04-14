'use strict';
// settings test
describe('401 interceptor', function() {

    var scope, repo, httpBackend, createFactory, fakeLocation, fakeResponse, fakeFail, fakeError, window, path, q;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.inject(function($injector, $q, $location, $window) {
        // $location.path = 'home';

        var deferred = $q.defer();
        var promise = deferred.promise;
        var resolveValue;
        window = $window;
        promise.then(function(value) { resolveValue = value; });

        deferred.resolve({
            value: {
                id: 2757082,
                login: 'login-1',
                repos: [1234, 1235, 1236]
            }
        });

        q = $q;

        createFactory = function() {
            var factory = $injector.get('401HttpResponseInterceptor');
            return factory;
        };

        path = $location.path();

        fakeResponse = {status: 200};
        fakeFail = {status: 401};
        fakeError = {status: 404};
    }));

    // should have promise reject upon 401

    it('should return response error', function() {
        var factory = createFactory();
        (factory.response(fakeFail)).should.be.exactly(q.reject(fakeFail));
        (window.location.href).should.be.exactly('/auth/github?next=' + path);
        (factory.responseError(fakeFail)).should.be.exactly(q.reject(fakeFail));
        (window.location.href).should.be.exactly('/auth/github?next=' + path);
        (factory.responseError(fakeError)).should.be.exactly(q.reject(fakeError));
    });

    it('should pass and return response', function() {
        var factory = createFactory();
        (factory.response(fakeResponse)).should.be.exactly(fakeResponse);
    });

});
