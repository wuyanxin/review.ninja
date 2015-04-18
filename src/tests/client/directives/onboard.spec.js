'use strict';
// settings test
describe('Onboard Directive', function() {

    var rootScope, scope, elScope, repo, httpBackend, createDirective, element;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));
    beforeEach(angular.mock.inject(function($stateParams) {
        $stateParams.user = 'gabe';
        $stateParams.repo = 'test';
    }));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $compile, $stateParams, $q) {
        httpBackend = $injector.get('$httpBackend');
        httpBackend.when('GET', '/config').respond({
            
        });

        httpBackend.expect('POST', '/api/onboard/getactions').respond({
            value: {
                'user:addRepo': true,
                'pullRequests:get': true
            }
        });

        // create user promise
        rootScope = $rootScope;
        scope = $rootScope.$new();
        var deferred = $q.defer();
        deferred.resolve({
            value: {
                id: 2757082,
                login: 'login-1',
                repos: [1234, 1235, 1236]
            }
        });
        var promise = deferred.promise;
        
        rootScope.promise = promise;
        rootScope.$digest();
        scope.$digest();
        element = $compile('<onboard></onboard>')(scope);
        console.log(element);
        scope.$digest();
        elScope = element.isolateScope();
    }));

    // afterEach(function() {
    //     httpBackend.verifyNoOutstandingExpectation();
    //     httpBackend.verifyNoOutstandingRequest();
    // });

    // should get a user’s completed actions for onboarding
    it('should add the right actions for onboarding', function() {
        httpBackend.flush();
        (scope.complete).should.be.false;
    });

    // should add transition class to element
    it('should add transition class to an element', function($compile) {
        var fakeNoClass = $compile('<div class="ob"></div>')(elScope);
        console.log(fakeNoClass);
        elScope.addClass('ob', 'test');
        elScope.$digest();
        console.log(fakeNoClass);
        (fakeNoClass).should.be.eql($compile('<div class="ob test"></div>')(elScope));
    });

    // should remove transition class from element
    it('should remove a transition class from an element', function($compile) {
        var fakeClass = $compile('<div class="ob test"></div>')(elScope);
        console.log(fakeClass);
        elScope.removeClass('ob', 'test');
        elScope.$digest();
        console.log(fakeClass);
        (fakeClass).should.be.eql($compile('<div class="ob"></div>')(elScope));
    });

    // socket -> get user’s actions upon getting action value from server

});
