'use strict';
// settings test
describe('Issue Factory', function() {

    var scope, repo, httpBackend, Issue, fakeIssue;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        scope = $rootScope.$new();

        Issue = $injector.get('Issue');
        fakeIssue = {
            body: 'Test body\r\n\r\n' +
           '|commit|file reference|pull request|   |\r\n' +
           '|------|--------------|------------|---|\r\n' +
           '|*commitsha*|[src/tests/server/api/issue.js#L24](https://github.com/reviewninja/review.ninja/blob/*commitsha*/src/tests/server/api/issue.js#L24)| #1 |[![#1](https://review.ninja/assets/images/icon-alt-36.png)](https://review.ninja/reviewninja/review.ninja/pull/1)|'
       };
    }));

    it('should parse issue well', function() {
        var resultingIssue = {
            body: '',
            sha: '*commitsha*',
            ref: 'src/tests/server/api/issue.js#L24',
            path: 'https://github.com/reviewninja/review.ninja/blob/*commitsha*/src/tests/server/api/issue.js#L24',
            start: '#1',
            end: null,
            key: '*commitsha*' + '/' + 'src/tests/server/api/issue.js#L24'
        };
        var result = Issue.parse(fakeIssue);
        (result).should.be.eql(resultingIssue);
    });

});