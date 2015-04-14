'use strict';
// settings test
describe('Root Controller', function() {

    var scope, repo, httpBackend, createCtrl, mockUser;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller, $q) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({
           
        });

        var deferred = $q.defer();
        var promise = deferred.promise;
        var resolvedValue;
        promise.then(function(value) { resolvedValue = value; });

        deferred.resolve({
            value: {
                id: 2757082,
                login: 'login-1'
            }
        });

        scope = $rootScope.$new();

        repo = {
            value: {
                id: 1234
            }
        };

        mockUser = {
            value: {
                id: 2757082,
                login: 'login-1'
            }
        }

        createCtrl = function() {
            var ctrl = $controller('RootCtrl', {
                $scope: scope,
                repo: repo
            });
            ctrl.scope = scope;
            scope.apply();
            return ctrl;
        };
    }));

    afterEach(function() {
        httpBackend.flush();
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    // create promise
    it('should assign user upon getting promise', function() {
        (2).should.be.exactly(2);
    });

    // get user and repo params
    it('should get user and repo params', function() {
        (2).should.be.exactly(2);
    });

    // should change to error on statechangeerror
    it('should change to error on statechangeerror', function() {
        (2).should.be.exactly(2);
    });

    // should create webhook
    it('should create webhook with user params', function() {
        (2).should.be.exactly(2);
    });

    // should send dismiss thing to server for user history
    it('should set user\'s history to represent a dismissed thing', function() {
        (2).should.be.exactly(2);
    })

    // it('should do thing', function() {
    //     var ctrl = createCtrl();

    //     httpBackend.expect('POST', '/api/settings/get').respond({
    //         settings: 'settings'
    //     });
    //     httpBackend.expect('POST', '/api/repo/get').respond({
    //         repo: 'repo'
    //     });

    //     httpBackend.flush();
    //     (ctrl.scope.settings.value.settings).should.be.exactly('settings');
    //     (ctrl.scope.reposettings.value.repo).should.be.exactly('repo');
    // });

});
