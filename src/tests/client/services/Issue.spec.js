'use strict';
// settings test
describe('Issue Factory', function() {

    var scope, repo, httpBackend, Issue, fakeIssue, stateParams;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $stateParams) {
        $stateParams.user = 'gabe';
        $stateParams.repo = 'repo1';

        stateParams = $stateParams;

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        scope = $rootScope.$new();

        Issue = $injector.get('Issue');
    }));

    it('should parse issue well', function() {
        var fakeIssue = {
            body: '|commit|file reference|pull request|   |\r\n' +
            '|------|--------------|------------|---|\r\n' +
            '|abcdabcd12341234abcdabcd12341234abcdabcd|[culture#L1](https://github.com/reviewninja/foo/blob/abcdabcd12341234abcdabcd12341234abcdabcd/culture#L1)| #1 |[![#1](http://app.review.ninja/assets/images/icon-alt-36.png)](http://app.review.ninja/reviewninja/foo/pull/1)|'
        };
        var resultingIssue = {
            body: '',
            sha: 'abcdabcd12341234abcdabcd12341234abcdabcd',
            ref: 'culture#L1',
            path: 'culture',
            start: 1,
            end: null,
            key: 'abcdabcd12341234abcdabcd12341234abcdabcd/culture#L1'
        };
        var result = Issue.parse(fakeIssue);
        (result).should.be.eql(resultingIssue);
    });
});
