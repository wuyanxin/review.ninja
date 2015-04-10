'use strict';
// settings test
describe('Merge Directive', function() {

    var scope, repo, httpBackend, createDirective;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $directive) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        scope = $rootScope.$new();

        repo = {
            value: {
                id: 1234
            }
        };
        createDirective = function() {

            var directive = $directive('mergeButton', {
                $scope: scope,
                repo: repo
            });
            directive.scope = scope;
            return directive;
        };
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should do thing', function() {
        var directive = createDirective();

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
