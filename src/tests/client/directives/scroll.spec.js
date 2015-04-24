'use strict';
// settings test
describe('Scroll Directive', function() {

    var scope, httpBackend, element, isolated;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $compile) {
        httpBackend = $injector.get('$httpBackend');
        httpBackend.when('GET', '/config').respond({});

        scope = $rootScope.$new();

        element = $compile('<scroll></scroll>')(scope);
        scope.$digest();
        isolated = element.isolateScope();
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    // should scroll to location successfully

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
