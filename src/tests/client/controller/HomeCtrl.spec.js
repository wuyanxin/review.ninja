// home test
describe('Home Controller', function() {

    var scope, httpBackend, createCtrl;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({
            data: {
                gacode: 'google-analytics-code'
            }
        });

        scope = $rootScope.$new();

        createCtrl = function() {
            return $controller('HomeCtrl', {
                $scope: scope
            });
        };
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should toggle off', function() {

        var ctrl = createCtrl();

        // load the data

        httpBackend.expect('POST', '/api/github/call', '{"obj":"repos","fun":"getAll","arg":{}}').respond({
            data: [{
                id: 1,
                name: 'repo-1',
                owner: {
                    login: 'me'
                },
            }]
        });

        httpBackend.expect('POST', '/api/github/call', '{"obj":"user","fun":"getOrgs","arg":{}}').respond({
            data: [{
                id: 1,
                login: 'my-org'
            }]
        });

        httpBackend.expect('POST', '/api/github/call', '{"obj":"repos","fun":"getFromOrg","arg":{"org":"my-org"}}').respond({
            data: [{
                id: 2,
                name: 'repo-2',
                owner: {
                    login: 'my-org'
                },
            }]
        });

        httpBackend.when('POST', '/api/repo/get').respond({
            name: 'repo-1',
            ninja: true,
            user: 'me',
            uuid: 1
        });

        httpBackend.flush();


        // now toggle the repo

        scope.repos[0].ninja.ninja = !scope.repos[0].ninja.ninja;

        scope.toggle(scope.repos[0]);

        httpBackend.expect('POST', '/api/repo/rmv', '{"user":"me","repo":"repo-1","uuid":1}').respond({
            name: 'repo-1',
            ninja: false,
            user: 'me',
            uuid: 1
        });

        httpBackend.flush();

        scope.repos[0].ninja.ninja.should.be.exactly.false;
    });

    it('should toggle on', function() {

        var ctrl = createCtrl();

        // load the data

        httpBackend.expect('POST', '/api/github/call', '{"obj":"repos","fun":"getAll","arg":{}}').respond({
            data: [{
                id: 2,
                name: 'repo-2',
                owner: {
                    login: 'me'
                }
            }]
        });

        httpBackend.expect('POST', '/api/github/call', '{"obj":"user","fun":"getOrgs","arg":{}}').respond({
            data: [{
                id: 1,
                login: 'my-org'
            }]
        });

        httpBackend.expect('POST', '/api/github/call', '{"obj":"repos","fun":"getFromOrg","arg":{"org":"my-org"}}').respond({
            data: [{
                id: 2,
                name: 'repo-2',
                owner: {
                    login: 'my-org'
                },
            }]
        });

        httpBackend.when('POST', '/api/repo/get').respond({
            'name': 'repo-2',
            'ninja': false,
            'user': 'me',
            'uuid': 2
        });

        httpBackend.flush();


        // now toggle the repo

        scope.repos[0].ninja.ninja = !scope.repos[0].ninja.ninja;

        scope.toggle(scope.repos[0]);

        httpBackend.expect('POST', '/api/repo/add', '{"user":"me","repo":"repo-2","uuid":2}').respond({
            name: 'repo-2',
            ninja: true,
            user: 'me',
            uuid: 1
        });

        httpBackend.flush();

        scope.repos[0].ninja.ninja.should.be.exactly.true;
    });


});
