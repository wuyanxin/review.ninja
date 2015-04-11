'use strict';
// settings test
describe('Pull Controller', function() {

    var scope, repo, httpBackend, createCtrl, Pull;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller) {

        httpBackend = $injector.get('$httpBackend');

        Pull = $injector.get('Pull');

        httpBackend.when('GET', '/config').respond({

        });
        scope = $rootScope.$new();

        repo = {
            value: {
                id: 1234
            }
        };
        createCtrl = function() {

            var ctrl = $controller('PullCtrl', {
                $scope: scope,
                Pull: 'Pull',
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

    // get pull request

    // set line selection

    // get combined statuses

    // get repo settings for threshold

    // get pull request comments

    // get open issues

    // get closed issues

    // get star number text

    // compcomm

    // set star on pr

    // get pull request

    // create issue

    // add comment

    // watch

    // badge modal

    // all the socket functions

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
