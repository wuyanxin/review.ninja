'use strict';
// settings test
describe('Root Controller', function() {

    var rootScope, scope, repo, httpBackend, createCtrl, q;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller, $stateParams, $q) {
        $stateParams.user = 'gabe';
        $stateParams.repo = 1234;
        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });

        rootScope = $rootScope;
        scope = $rootScope.$new();
        q = $q;

        scope.query = 'user/repo';
        // rootScope.promise = promise;

        createCtrl = function() {
            var ctrl = $controller('RootCtrl', {
                $scope: scope,
                $rootScope: rootScope,
                $stateParams: $stateParams
            });
            return ctrl;
        };

        httpBackend.expect('POST', '/api/github/wrap', '{"obj":"user","fun":"get","arg":' + JSON.stringify({
        }) + '}').respond({
            value: {
                id: 2757082,
                login: 'login-1',
                repos: [1234, 1235, 1236]
            }
        });
    }));

    // create promise
    // get user and repo params
    // should change to error on statechangeerror
    // should create webhook
    // should send dismiss thing to server for user history

    it('should return user from promise', function() {
        var RootCtrl = createCtrl();
        var deferred = q.defer();
        deferred.resolve({
            value: {
                id: 2757082,
                login: 'login-1',
                repos: [1234, 1235, 1236]
            }
        });
        var promise = deferred.promise;
        rootScope.promise = promise;
        rootScope.$digest();
        scope.$digest();
        (rootScope.user).should.be.eql({
            id: 2757082,
            login: 'login-1',
            repos: [1234, 1235, 1236]
        });
    });

    it('should create webhook', function() {

    });

});