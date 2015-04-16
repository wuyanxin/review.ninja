'use strict';
// home test
describe('Home Controller', function() {

    var scope, httpBackend, createCtrl;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller, $q) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });

        httpBackend.when('GET', '/api/github/call', '{"obj":"repos","fun":"one","arg":{"id":21620444}}').respond({
            data: {
                name: 'repo-1',
                user: 'me',
                id: 21620444
            }
        });

        httpBackend.expect('POST', '/api/github/call', '{"obj":"repos","fun":"one","arg":{"id":21620444}}').respond({
            data: {
                name: 'repo-1',
                user: 'me',
                id: 21620444
            }
        });

        // create promise for user

        scope = $rootScope.$new();
        var deferred = $q.defer();
        var promise = deferred.promise;
        promise.then(function(value) { scope.user = value; });

        deferred.resolve({
            value: {
                id: 2757082,
                login: 'login-1',
                repos: [1234, 1235, 1236]
            }
        });

        scope.query = 'user/repo';
        scope.promise = promise;
        scope.repos = [];

        createCtrl = function() {
            return $controller('HomeCtrl', {
                $scope: scope
            });
        };
        scope.$apply();
    }));

    // load user repos
    // add a repo
    // remove repo
    // create onboarding repo
    
    // it('should load user repos propely', function() {

    //     var ctrl = createCtrl();

    //     // load the data

    //     httpBackend.expect('POST', '/api/user/get').respond({
    //         '__v': 18,
    //         '_id': {
    //             '$oid': '53f991fbee5d5ef38f67ce5f'
    //         },
    //         'repos': [
    //             21620444
    //         ],
    //         'token': '3004a2ac4c2055dfed8258274fb697bd8638bf32',
    //         'uuid': 1387834
    //     });

    //     httpBackend.expect('POST', '/api/github/call', '{"obj":"repos","fun":"getAll","arg":{"headers":{"accept":"application/vnd.github.moondragon+json"},"per_page":50}}').respond({
    //         data: []
    //     });

    //     httpBackend.expect('POST', '/api/github/call', '{"obj":"repos","fun":"one","arg":{"id":21620444}}').respond({
    //         data: {
    //             name: 'repo-1',
    //             user: 'me',
    //             id: 21620444
    //         }
    //     });

    //     httpBackend.flush();

    //     (scope.repos[0].name).should.be.exactly('repo-1');
    // });


    // it('should add a repo without error', function() {
    //     var ctrl = createCtrl();

    //     // load the data

    //    httpBackend.expect('POST', '/api/user/get').respond({
    //         '__v': 18,
    //         '_id': {
    //             '$oid': '53f991fbee5d5ef38f67ce5f'
    //         },
    //         'repos': [
    //             21620444
    //         ],
    //         'token': '3004a2ac4c2055dfed8258274fb697bd8638bf32',
    //         'uuid': 1387834

    //     });

    //     httpBackend.expect('POST', '/api/github/call', '{"obj":"repos","fun":"getAll","arg":{"headers":{"accept":"application/vnd.github.moondragon+json"},"per_page":50}}').respond({
    //         data: []
    //     });

    //     httpBackend.expect('POST', '/api/github/call', '{"obj":"repos","fun":"one","arg":{"id":21620444}}').respond({
    //         data: {
    //             name: 'repo-1',
    //             user: 'me',
    //             id: 21620444
    //         }
    //     });

    //     httpBackend.flush();

    //     scope.add({owner: {login: 'login'}, name: 'name', id: '1234'});

    //     httpBackend.expect('POST', '/api/user/addRepo').respond(null);
    //     httpBackend.flush();

    //     scope.repos.length.should.be.exactly(2);
    // });


    // it('should remove a repo without error', function() {
    //            var ctrl = createCtrl();

    //     // load the data

    //     httpBackend.expect('POST', '/api/user/get').respond({
    //         '__v': 18,
    //         '_id': {
    //             '$oid': '53f991fbee5d5ef38f67ce5f'
    //         },
    //         'repos': [
    //             21620444
    //         ],
    //         'token': '3004a2ac4c2055dfed8258274fb697bd8638bf32',
    //         'uuid': 1387834
    //     });

    //     httpBackend.expect('POST', '/api/github/call', '{"obj":"repos","fun":"getAll","arg":{"headers":{"accept":"application/vnd.github.moondragon+json"},"per_page":50}}').respond({
    //         data: []
    //     });

    //     httpBackend.expect('POST', '/api/github/call', '{"obj":"repos","fun":"one","arg":{"id":21620444}}').respond({
    //         data: {
    //             name: 'repo-1',
    //             user: 'me',
    //             id: 21620444
    //         }
    //     });

    //     httpBackend.flush();


    //     scope.remove({owner: {login: 'login'}, name: 'name', id: '1234'});

    //     httpBackend.expect('POST', '/api/user/rmvRepo').respond(null);

    //     httpBackend.flush();

    //     scope.repos.length.should.be.exactly(0);

    // });

});
