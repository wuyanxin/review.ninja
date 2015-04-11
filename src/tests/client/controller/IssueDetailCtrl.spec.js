'use strict';
// settings test
describe('Issue Detail Controller', function() {

    var scope, repo, httpBackend, createCtrl, Issue;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller) {

        httpBackend = $injector.get('$httpBackend');
        Issue = $injector.get('Issue');

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
                Issue: 'Issue',
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

    // get comments on issue
    // get anchor?
    // set state of issue to close
    // add a comment to issue
    // get proper status text of issue depending on if there is comment
    // web socket functions 

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
