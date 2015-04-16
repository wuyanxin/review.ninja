'use strict';
// settings test
describe('Pull Controller', function() {

    var scope, repo, httpBackend, createCtrl, PullCtrl, PullMock, IssueMock;

    beforeEach(angular.mock.module('app'));
    beforeEach(angular.mock.module('templates'));
    // beforeEach(angular.mock.module('ninja.services'));
    beforeEach(function() {
        PullMock = {
            milestone: function(val) {

            },

            render: function(val) {

            },

            stars: function(val, t) {

            }
        };
    });

    beforeEach(function() {
        IssueMock = {
            parse: function(val) {

            },

            render: function(val) {

            }
        };
    });

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller) {
        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/api/user/get').respond({

        });
        scope = $rootScope.$new();

        repo = {
            value: {
                id: 1234
            }
        };

        PullCtrl = $controller('PullCtrl', {
            $scope: scope,
            repo: repo.value,
            sha: null,
            Pull: PullMock,
            Issue: IssueMock
        });
        PullCtrl.scope = scope;
    }));

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
        httpBackend.flush();
    });

});
