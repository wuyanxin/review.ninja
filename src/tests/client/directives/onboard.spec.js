'use strict';
// settings test
describe('Onboard Directive', function() {

    var scope, repo, httpBackend, createDirective, element;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $compile) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        scope = $rootScope.$new();

        // create user promise

        repo = {
            value: {
                id: 1234
            }
        };
        element = $compile('<onboard></onboard>')($rootScope);
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    // should get a user’s completed actions for onboarding
    // should add transition class to element
    // should remove transition class from element
    // socket -> get user’s actions upon getting action value from server

    it('should do thing', function() {

        httpBackend.expect('POST', '/api/settings/get').respond({
            settings: 'settings'
        });
        httpBackend.expect('POST', '/api/repo/get').respond({
            repo: 'repo'
        });

        httpBackend.flush();
        (directive.scope.settings.value.settings).should.be.exactly('settings');
        (directive.scope.reposettings.value.repo).should.be.exactly('repo');
    });

});
