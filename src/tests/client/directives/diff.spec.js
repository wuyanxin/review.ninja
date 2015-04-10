'use strict';
// settings test
describe('Diff File Directive', function() {

    var scope, repo, httpBackend, createDirective;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope) {

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

            var directive = $injector.get('diff');
            directive.scope = scope;
            return directive;
        };
    }));

    // should expand diff successfully

    // should find chunks of file

    // should insert chunks successfully

    // should set file

    // should clear selection

    // should determine where selection starts

    // should determine reference is selected

    // should determine where reference starts again

    // should return reference anchor

    // should determine if line is referenced

    // should do thing upon selection of line

    // should go to line

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
