'use strict';
// settings test
describe('Focus Directive', function() {

    var scope, httpBackend, element, isolated, timeout;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $compile, $timeout) {

        httpBackend = $injector.get('$httpBackend');
        httpBackend.when('GET', '/config').respond({});

        scope = $rootScope.$new();
        timeout = $timeout;
        element = $compile('<focus><div></div></focus>')(scope);
        scope.$digest();
        isolated = element.isolateScope();
    }));

    // should watch if elem is focused
    it('should watch if element is focused', function() {
    });

    // should focus on focus
});
