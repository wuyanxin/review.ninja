'use strict';
// settings test
describe('Pull Controller', function() {

    var scope, rootScope, repo, httpBackend, createCtrl, PullCtrl, PullMock, IssueMock;

    beforeEach(angular.mock.module('app'));
    beforeEach(angular.mock.module('templates'));
    // beforeEach(angular.mock.module('ninja.services'));


    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller, $stateParams) {
        $stateParams.user = 'gabe';
        $stateParams.repo = 'repo1';
        $stateParams.number = '1.3.0';
        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });

        httpBackend.expect('POST', '/api/github/call', '{"obj":"issues","fun":"getMilestone","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'repo1',
          number: '1.3.0'
        }) + '}').respond({
            value: 'success'
        });

        httpBackend.expect('POST', '/api/star/all', JSON.stringify({
          sha: 'magic',
          repo_uuid: 11111
        })).respond({
            value: 'success'
        });

        httpBackend.expect('POST', '/api/github/call', '{"obj":"statuses","fun":"getCombined","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'repo1',
          sha: 'magic'
        }) + '}').respond({
            value: 'success'
        });

        httpBackend.expect('POST', '/api/repo/get', JSON.stringify({
          repo_uuid: 1234
        })).respond({
            value: 'success'
        });

        httpBackend.expect('POST', '/api/github/call', '{"obj":"issues","fun":"getComments","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'repo1',
          number: '1.3.0'
        }) + '}').respond({
            value: 'success'
        });

        httpBackend.expect('POST', '/api/github/call', '{"obj":"issues","fun":"repoIssues","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'repo1',
          state: 'open',
          milestone: '1.3.0',
        }) + '}').respond({
            value: 'success'
        });

        httpBackend.expect('POST', '/api/github/call', '{"obj":"issues","fun":"repoIssues","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'repo1',
          state: 'closed',
          milestone: '1.3.0',
        }) + '}').respond({
            value: 'success'
        });

        scope = $rootScope.$new();
        rootScope = $rootScope;

        var fakePull = {
            base: {
                repo: {
                    owner: {
                        login: 'gabe'
                    },
                    name: 'repo1',
                    id: 11111
                }
            },
            head: {
                sha: 'magic',
            },
            milestone: {
                number: '1.3.0',
                id: 1234
            },
            number: 1
        };

        createCtrl = function() {
            var ctrl = $controller('PullCtrl', {
                $scope: scope,
                $rootScope: rootScope,
                repo: {value: {id: 1234}},
                pull: {value: fakePull}
            });
            return ctrl;
        }
    }));

    // get pull request
    it('should set stuff', function() {
        PullCtrl = createCtrl();
        httpBackend.flush();
    });

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

});
