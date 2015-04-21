'use strict';
// settings test
describe('Issue List Controller', function() {

    var scope, repo, httpBackend, createCtrl, Issue;

    beforeEach(angular.mock.module('app'));
    beforeEach(angular.mock.module('templates'));
    beforeEach(angular.mock.module('ninja.services'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        scope = $rootScope.$new();

        scope.pull = {
            base: {
                sha: 'magic'
            }
        };

        scope.$parent = {
            $parent: {
                sha: 'thing'
            }
        };

        scope.compComm = function(sha) {
            return true;
        };

        createCtrl = function() {
            var ctrl = $controller('IssueListCtrl', {
                $scope: scope,
                repo: repo,
            });
            ctrl.scope = scope;
            return ctrl;
        };
    }));

    it('should set parent sha to null', function() {
        var ctrl = createCtrl();
        ([scope.$parent.$parent.sha]).should.be.eql([null]);
    });
});
