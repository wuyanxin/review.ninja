'use strict';
// settings test
describe('Issue List Controller', function() {

    var scope, repo, httpBackend, createCtrl, Issue;

    beforeEach(angular.mock.module('app'));
    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        scope = $rootScope.$new();

        scope.pull = {
            base: {
                sha: 'magic'
            }
        };

        scope.$parent = {
            $parent: {
                sha: 'thing'
            }
        };

        scope.compComm = function(sha) {
            return true;
        };

        createCtrl = function() {
            var ctrl = $controller('IssueListCtrl', {
                $scope: scope,
                repo: repo
            });
            ctrl.scope = scope;
            return ctrl;
        };
    }));

    it('should set parent sha to null', function() {
        var ctrl = createCtrl();
        ([scope.$parent.$parent.sha]).should.be.eql([null]);
    });

    it('should return proper reference with anchor', function() {
        var ctrl = createCtrl();
        var issue = {
            value: {
                body: '|commit|file reference|pull request|   |\r\n' +
                '|------|--------------|------------|---|\r\n' +
                '|abcdabcd12341234abcdabcd12341234abcdabcd|[culture#L1](https://github.com/reviewninja/foo/blob/abcdabcd12341234abcdabcd12341234abcdabcd/culture#L1)| #1 |[![#1](http://app.review.ninja/assets/images/icon-alt-36.png)](http://app.review.ninja/reviewninja/foo/pull/1)|'
            },
            sha: 'abcdabcd12341234abcdabcd12341234abcdabcd',
            path: 'culture',
            line: '#1',
            start: 1
        };
        var result = scope.anchor(issue);
        (result).should.be.exactly('abcdabcd12341234abcdabcd12341234abcdabcd:culture:1');
    });
});
