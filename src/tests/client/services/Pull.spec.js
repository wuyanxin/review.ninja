'use strict';
// pull test
describe('Pull Factory', function() {

    var scope, rootScope, httpBackend, Pull, pull, pull2;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $stateParams, $q) {
        $stateParams.user = 'gabe';
        $stateParams.repo = 'repo1';

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        var deferred = $q.defer();
        deferred.resolve({
            value: {
                id: 2757082,
                login: 'login-1',
                repos: [1234, 1235, 1236]
            }
        });
        var promise = deferred.promise;

        scope = $rootScope.$new();
        rootScope = $rootScope;
        rootScope.promise = promise;

        Pull = $injector.get('Pull');
        pull = {
            base: {
                repo: {
                    owner: {
                        login: 'gabe'
                    },
                    name: 'repo1',
                    id: 11111
                }
            },
            head: {
                sha: 'magic'
            },
            number: 1
        };
    }));

    // should get star count
    it('should get star count', function(){
        httpBackend.expect('POST', '/api/star/all', JSON.stringify({
          sha: 'magic',
          repo_uuid: 11111
        })).respond([{
                name: 'gabe'
            }, {
                name: 'blah'
        }]);
        var fakePull = {head: {sha: 'magic'}, base: {repo: {id: 11111}}};
        var result = Pull.stars(fakePull, null);
        httpBackend.flush();
        ([result.star]).should.be.eql([null]);
        (result.stars).should.be.eql([{name: 'gabe'}, {name: 'blah'}]);
    });

    // should get comments count
    it('should get comments count', function(){
        var pullComments = {
            base: {
                repo: {
                    owner: {
                        login: 'gabe'
                    },
                    name: 'repo1',
                    id: 11111
                }
            },
            head: {
                sha: 'magic'
            },
            number: 1,
            commentsCount: 5
        };

        httpBackend.expect('POST', '/api/github/call', '{"obj":"issues","fun":"getComments","arg":' + JSON.stringify({
            user: 'gabe',
            repo: 'repo1',
            number: 1,
            per_page: 10
        }) + '}').respond(200, {
            data: ['these', 'are', 'some', 'test', 'comments']
        });
        var result = Pull.commentsCount(pull);
        httpBackend.flush();
        (result.commentsCount).should.be.exactly(5);
        (result).should.be.eql(pullComments);
    });
});
