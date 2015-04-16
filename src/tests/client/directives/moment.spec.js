'use strict';
// settings test
describe('Moment Directive', function() {

    var scope, httpBackend, element, elScope, timeout, compile;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $compile, $timeout) {
        httpBackend = $injector.get('$httpBackend');
        httpBackend.when('GET', '/config').respond({
            
        });

        scope = $rootScope.$new();
        timeout = $timeout;
        element = $compile("<div moment></div>")(scope);
        scope.$digest();
        elScope = element.isolateScope();
        console.log(elScope);
        elScope.moment = 0;
    }));
    
    // should refresh
    it('should refresh upon new moment value', function() {
        elScope.moment = 2;
        elScope.$apply();
        timeout.flush();
    })
    // should call moment successfully
});
