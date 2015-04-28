'use strict';
// settings test
describe('Scroll Directive', function() {

    var scope, httpBackend, element, isolated;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $compile) {
        httpBackend = $injector.get('$httpBackend');
        httpBackend.when('GET', '/config').respond({});

        scope = $rootScope.$new();

        element = $compile('<div scroll=\"\"></div>')(scope);
        scope.$digest();
        isolated = element.isolateScope();
    }));
    // should scroll to location successfully
});
