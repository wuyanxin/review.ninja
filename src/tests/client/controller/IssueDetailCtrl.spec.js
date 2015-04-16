'use strict';
// settings test

angular.module('mock.users', []).factory('User')
describe('Issue Detail Controller', function() {

    var scope, repo, httpBackend, IssueDetailCtrl;

    beforeEach(angular.mock.module('app'));
    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller, $provide) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        scope = $rootScope.$new();
        scope.$parent = {$parent: {}};

        var IssueDetailCtrl = $controller('IssueDetailCtrl', {
            $scope: scope,
        });
    }));

    it('should update comparison view', function() {

    });

    it('should set issue sha to null', function() {
        ([scope.parent.parent.sha]).should.be.eql([null]);
    });

});
