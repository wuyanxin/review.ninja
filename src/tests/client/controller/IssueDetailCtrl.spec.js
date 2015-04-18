'use strict';
// settings test
describe('Issue Detail Controller', function() {

    var scope, rootScope, httpBackend, createCtrl;

    beforeEach(angular.mock.module('app'));
    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        scope = $rootScope.$new();
        rootScope = $rootScope;
        var repo = {
            value: {
                id: 1234
            }
        };
        var issue = {
            value: {
                body: '|commit|file reference|pull request|   |\r\n' + 
                '|------|--------------|------------|---|\r\n' + 
                '|abcdabcd12341234abcdabcd12341234abcdabcd|[culture#L1](https://github.com/reviewninja/foo/blob/abcdabcd12341234abcdabcd12341234abcdabcd/culture#L1)| #1 |[![#1](http://app.review.ninja/assets/images/icon-alt-36.png)](http://app.review.ninja/reviewninja/foo/pull/1)|'
            }
        };

        createCtrl = function() {
            var ctrl = $controller('IssueDetailCtrl', {
                $scope: scope,
                $rootScope: rootScope,
                repo: repo,
                issue: issue
            });
            return ctrl;
        }
    }));
    it('should test if stuff is created', function() {
        var IssueDetailCtrl = createCtrl();
        (scope.repo).should.be.eql({id: 1234});
    });

    it('should update comparison view', function() {

    });

});
