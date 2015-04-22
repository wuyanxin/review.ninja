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

    it('should do stuff with state change success', function() {
        rootScope.$broadcast('$stateChangeSuccess');
    });

    // create promise
    // get user and repo params
    // should change to error on statechangeerror

    it('should return user from promise', function() {
        var RootCtrl = createCtrl();
        rootScope.$digest();
        rootScope.$apply();
        scope.$digest();
        scope.$apply();
        (rootScope.user).should.be.eql({
            id: 2757082,
            login: 'login-1',
            repos: [1234, 1235, 1236]
        });
    });

    it('should send call to create webhook', function() {
        rootScope.user = {value: {id: 1}};
        httpBackend.expect('POST', '/api/webhook/create', JSON.stringify({
            user: 'gabe',
            repo: 1234,
            user_uuid: 1
        })).respond({
            value: 1
        });
        var ctrl = createCtrl();
        scope.createWebhook();
        httpBackend.flush();
        (scope.hook).should.be.eql({value: 1});
        (scope.created).should.be.true;
    });

    it('should send call to dismiss from history', function() {
        rootScope.user = {value: {history: {'create': false}}};
        httpBackend.expect('POST', '/api/user/dismiss', JSON.stringify({
            dismiss: 'create'  
        })).respond({
            value: true
        });
        var ctrl = createCtrl();
        scope.dismiss('create');
        httpBackend.flush();
        (rootScope.user.value.history['create']).should.be.true;
    });
});
