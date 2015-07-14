'use strict';
// settings test
describe('Diff File Directive', function() {

    var scope, repo, httpBackend, element, elScope, rootScope;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $compile, $stateParams) {
        $stateParams.user = 'gabe';
        $stateParams.repo = 1234;

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        rootScope = $rootScope;
        scope = $rootScope.$new();
        scope.file = {
            ignored: false,
            sha: 'aaaa',
            filename: 'hello/world'
        };
        scope.headSha = 'aaaa';
        scope.issues = [{path: 'hello/world', sha: 'aaaa', start: 5, end: 88, number: 2}, {path: 'hello/world', sha: 'aaaa', start: 5, end: 23, number: 3}];
        scope.selection = {path: 'hello/world', sha: 'aaaa', start: 1, end: 88};
        element = $compile('<diff file=\"file\" head-sha=\"headSha\" selection=\"selection\" issues=\"issues\"></diff>')(scope);
        scope.$digest();
        elScope = element.isolateScope();
    }));

    // test monster watch function

    // scope variables should be set
    it('should set scope variables', function() {
        (elScope.open).should.be.true;
        (elScope.expanded).should.be.false;
    });

    // todo: test new functions
});
