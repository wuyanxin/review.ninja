'use strict';
// settings test
describe('Issue Detail Controller', function() {

    var scope, repo, httpBackend, createCtrl;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        scope = $rootScope.$new();

        repo = {
            value: {
                id: 1234
            }
        };
        createCtrl = function() {

            var ctrl = $controller('IssueDetailCtrl', {
                $scope: scope,
                repo: repo
            });
            ctrl.scope = scope;
            return ctrl;
        };
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should do thing', function() {
        var ctrl = createCtrl();

        httpBackend.expect('POST', '/api/settings/get').respond({
            settings: 'settings'
        });
        httpBackend.expect('POST', '/api/repo/get').respond({
            repo: 'repo'
        });

        httpBackend.flush();
        (ctrl.scope.settings.value.settings).should.be.exactly('settings');
        (ctrl.scope.reposettings.value.repo).should.be.exactly('repo');
    });

});
