'use strict';
// settings test
describe('Root Controller', function() {

    var scope, repo, httpBackend, createCtrl;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller, $stateParams) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });

        $stateParams.user = 'gabe';
        $stateParams.repo = 1234;

        httpBackend.when('POST', '/api/github/call', '"obj": "repos", "fun": "get", "arg": ' + JSON.stringify({
            user: 'gabe',
            repo: 1234
        })).respond({
            value: {
                permissions: {
                    admin: true
                }
            }
        });

        httpBackend.when('POST', '/api/webhook/get', '"arg": ' + JSON.stringify({
            user: 'gabe',
            repo: 1234
        })).respond({
            value: {
                permissions: {
                    admin: true
                }
            }
        });

        scope = $rootScope.$new();

        repo = {
            value: {
                id: 1234
            }
        };
        createCtrl = function() {

            var ctrl = $controller('RootCtrl', {
                $scope: scope,
                repo: repo
            });
            ctrl.scope = scope;
            return ctrl;
        };
    }));

    it('should do thing', function() {
        var ctrl = createCtrl();
        // scope.$broadcast('$stateChangeSuccess');
        
    });

});