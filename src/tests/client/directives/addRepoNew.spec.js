'use strict';
// settings test
describe('Add Repo (new) Directive', function() {

    var scope, repo, httpBackend, element;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $compile) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        scope = $rootScope.$new();

        repo = {
            value: {
                id: 1234
            }
        };
        
        element = $compile("<add-repo-new></add-repo-new>")($rootScope);
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    // should get all repos
    // should successfully add repo
    // should say contains successfully

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
