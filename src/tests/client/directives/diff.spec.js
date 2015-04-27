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

    // should clear selection
    it('should clear selection', function() {
        elScope.clear();
        (elScope.selection).should.be.empty;
    });

    // should determine if selection starts
    it('should determine if selection starts', function() {
        var fakeLine = {
            head: 1
        };
        var result = elScope.selStarts(fakeLine);
        (result).should.be.true;
    });

    // should determine if is included
    it('should determine if selection is selected', function() {
        var fakeLine = {
            head: 44
        };
        var result = elScope.isSelected(fakeLine);
        (result).should.be.true;
    });

    // should determine ref starts again
    it('should determine if reference starts on issues', function() {
        elScope.issues = [{path: 'hello/world', sha: 'aaaa', start: 5, end: 88, number: 2}, {path: 'hello/world', sha: 'aaaa', start: 1, end: 99, number: 1}];
        var fakeLine = {
            head: 5
        };
        var result = elScope.refStarts(fakeLine);
        (result).should.be.true;
    });

    //should get anchor
    it('should return anchor correctly', function() {
        var result = elScope.anchor('abcdabcd12341234abcdabcd12341234abcdabcd', 'culture', '1');
        (result).should.be.exactly('abcdabcd12341234abcdabcd12341234abcdabcd:culture:1');
    });

    // should determine if is referenced
    it('should determine if line is referenced', function() {
        var fakeLine = {
            head: 19
        };
        var result = elScope.isReferenced(fakeLine);
        (result).should.be.true;
    });

    // should do thing upon select
    it('should get line selection', function() {
        var fakeLine = {
            head: 6
        };
        var fakeEvent = {shiftKey: true};
        var result = elScope.select(fakeLine, fakeEvent);
        (elScope.selection).should.be.eql({
            sha: 'aaaa',
            path: 'hello/world',
            start: 1,
            end: 6,
            ref: 'aaaa/hello/world#L1-L6'
        });
    });

    it('should do nothing if no line base', function() {
        var fakeLine = {};
        var result = elScope.select(fakeLine);
        ([result]).should.be.eql([undefined]);
    });

    // should go to line
    it('should go to line or set refIssues', function() {
        var fakeLine = {
            head: 5
        };
        elScope.go(fakeLine);
        (elScope.refIssues).should.be.eql([2, 3]);
    });
});
