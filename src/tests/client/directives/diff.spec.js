'use strict';
// settings test
describe('Diff File Directive', function() {

    var scope, repo, httpBackend, element, elScope;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $compile) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        scope = $rootScope.$new();
        scope.file = {ignored: false};
        element = $compile("<diff></diff>")(scope);
        scope.$digest();
        elScope = element.isolateScope();
        elScope.headSha = 'aaaa';
        elScope.path = 'hello/world';
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

    // should determine where selection starts
    it('should determine if selection starts', function() {
        var fakeLine = {
            base: 1
        };
        elScope.selection = {path: 'hello/world', sha: 'aaaa', start: 1};
        console.log('hahahaha');
        var result = elScope.selStarts(fakeLine);
        (result).should.be.true;
    });

    // should determine if is included
    it('should determine if selection is selected', function() {
        var fakeLine = {
            base: 44
        };
        elScope.selection = {path: 'hello/world', sha: 'aaaa', start: 1, end: 99};
        console.log('hahahaha');
        var result = elScope.isSelected(fakeLine);
        (result).should.be.true;
    });

    // should determine ref starts again
    it('should determine if reference starts on issues', function() {
        elScope.issues = [{path: 'hello/world', sha: 'aaaa', start: 5, end: 88, number: 2}, {path: 'hello/world', sha: 'aaaa', start: 1, end: 99, number: 1}];
        var fakeLine = {
            base: 5
        };
        var result = elScope.refStarts(fakeLine);
        (result).should.be.true;
    });

    // should determine if is referenced
    it('should determine if line is referenced', function() {
        elScope.issues = [{path: 'hello/world', sha: 'aaaa', start: 5, end: 88, number: 2}, {path: 'hello/world', sha: 'aaaa', start: 1, end: 99, number: 1}];
        var fakeLine = {
            base: 19
        };
        var result = elScope.isReferenced(fakeLine);
        (result).should.be.true;
    });

    // should do thing upon select
    it('should get line selection', function() {
        var fakeLine = {
            base: 9
        };
        var fakeEvent = {shiftKey: true};
        elScope.selection = {path: 'hello/world', start: 1};
        var result = elScope.select(fakeLine, fakeEvent);
        (result).should.be.eql({
            sha: elScope.headSha,
            path: elScope.path,
            start: 1,
            end: 9,
            ref: 'aaaa/hello/world#L1-L9'
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
            base: 5
        };
        var correctIssues = [{path: 'hello/world', sha: 'aaaa', start: 5, end: 88, number: 2}, {path: 'hello/world', sha: 'aaaa', start: 5, end: 23, number: 3}];
        elScope.issues = [{path: 'hello/world', sha: 'aaaa', start: 5, end: 88, number: 2}, {path: 'hello/world', sha: 'aaaa', start: 5, end: 23, number: 3}, {path: 'hello/world', sha: 'aaaa', start: 1, end: 99, number: 1}];
        elScope.go(fakeLine);
        (elScope.refIssues).should.be.eql(correctIssues);
    });
});
