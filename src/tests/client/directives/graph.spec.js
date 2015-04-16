'use strict';
// settings test
describe('Graph Directive', function() {

    var scope, httpBackend, element, isolated;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $compile) {
        httpBackend = $injector.get('$httpBackend');
        httpBackend.when('GET', '/config').respond({
            
        });

        scope = $rootScope.$new();

        element = $compile("<graph></graph>")(scope);
        scope.$digest();
        isolated = element.isolateScope();
    }));

    // should check if any openissues are on head sha
    it('should return true if head sha in open issues', function() {
        isolated.headSha = 111;
        isolated.openIssues = [111, 2222, 1111];
        var result = isolated.headCommitIssues();
        (result).should.be.true;
    });

    it('should return false if head sha not in open issues', function() {
        isolated.headSha = 111;
        isolated.openIssues = [222];
        var result = isolated.headCommitIssues();
        (result).should.be.false;
    });
});
