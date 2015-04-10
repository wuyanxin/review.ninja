'use strict';
// settings test
describe('401 interceptor', function() {

    var scope, repo, httpBackend, createFactory;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $factory) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        scope = $rootScope.$new();

        repo = {
            value: {
                id: 1234
            }
        };
        createFactory = function() {

            var factory = $factory('addRepoNew', {
                $scope: scope,
                repo: repo
            });
            factory.scope = scope;
            return factory;
        };
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should do thing', function() {
        var factory = createFactory();

        httpBackend.expect('POST', '/api/settings/get').respond({
            settings: 'settings'
        });
        httpBackend.expect('POST', '/api/repo/get').respond({
            repo: 'repo'
        });

        httpBackend.flush();
        (factory.scope.settings.value.settings).should.be.exactly('settings');
        (factory.scope.reposettings.value.repo).should.be.exactly('repo');
    });

});
