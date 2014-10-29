// repo test
describe('Repo Controller', function() {

    var scope, repo, httpBackend, createCtrl;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        scope = $rootScope.$new();

        repo = {
            value: {
                id: 1234
            }
        };
        createCtrl = function() {

            var ctrl =  $controller('RepoCtrl', {
                $scope: scope,
                repo:repo
            });
            ctrl.scope = scope;
            return ctrl;
        };
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should get open and closed pull requests', function() {
        var ctrl = createCtrl();

        httpBackend.expect('POST','/api/github/wrap','{"obj":"pullRequests","fun":"getAll","arg":{"state":"open"}}').respond({
            data:[{
                number: 1,
                base: {
                    repo: {
                        owner: {
                            login: 'reviewninja'
                        },
                        name: 'review.ninja'
                    }
                },
                user: {
                    login: 'johndoe'
                },
                milestone: {
                    number: 5
                }
            }]
        });

        httpBackend.expect('POST','/api/github/wrap','{"obj":"pullRequests","fun":"getAll","arg":{"state":"closed"}}').respond({
            data:[{
                number: 2,
                base: {
                    repo: {
                        owner: {
                            login: 'reviewninja'
                        },
                        name: 'review.ninja'
                    }
                },
                user: {
                    login: 'janedoe'
                },
                milestone: {
                    number: 6
                }
            }]
        });

        httpBackend.expect('POST','/api/github/call','{"obj":"issues","fun":"getMilestone","arg":{"user":"reviewninja","repo":"review.ninja","number":5}}').respond({
            data:[{
                issue: 'issue1'
            }]
        });

        httpBackend.expect('POST','/api/github/call','{"obj":"issues","fun":"getMilestone","arg":{"user":"reviewninja","repo":"review.ninja","number":6}}').respond({
            data:[{
                issue: 'issue1'
            }]
        });

        httpBackend.flush();

        (scope.open.value[0].number).should.be.exactly(1);
    });
});
