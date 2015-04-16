'use strict';
// settings test
describe('File Directive', function() {

    var scope, repo, httpBackend, element, elScope, Reference;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $compile, Reference) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });

        Reference = Reference;
        scope = $rootScope.$new();
        element = $compile("<file></file>")(scope);
        scope.$digest();
        elScope = element.isolateScope();
    }));

    // should clear selection
    it('should clear selection', function() {
        elScope.clear();
        (elScope.selection).should.be.empty;
    });

    // should determine where selection starts
    it('should determine where selection starts', function() {

    });

    // should determine if is selected
    // should determine ref starts again
    // should determine if is referenced

    // should do thing upon select

    // should go to line
});
