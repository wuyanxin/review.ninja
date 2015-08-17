'use strict';
// settings test
describe('Repo Controller', function() {

    var scope, repo, httpBackend, createCtrl;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller, $stateParams) {
        $stateParams.user = 'gabe';
        $stateParams.repo = 'test';
        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({});

        httpBackend.expect('POST', '/api/github/wrap', '{"obj":"pullRequests","fun":"getAll","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'test',
          state: 'open',
          per_page: 10
        }) + '}').respond({
            data: [{head: {sha: 'abcd1234'}}]
        });

        httpBackend.expect('POST', '/api/github/wrap', '{"obj":"pullRequests","fun":"getAll","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'test',
          state: 'closed',
          per_page: 10
        }) + '}').respond({
            data: [{head: {sha: 'abcd1234'}}]
        });

        httpBackend.expect('POST', '/api/github/wrap', '{"obj":"repos","fun":"getCollaborators","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'test'
        }) + '}').respond({
            data: ['david', 'dominik']
        });

        var mockPullService = {
            milestone: function(pull) {
                return pull;
            },
            stars: function(pull) {
                return pull;
            },
            commentsCount: function(pull) {
                return pull;
            }
        };

        var mockModal = {
            open: function(obj) {
                return (!!obj.templateUrl && !!obj.controller);
            }
        };

        $rootScope.$config = {};
        scope = $rootScope.$new();

        createCtrl = function() {
            var ctrl = $controller('RepoCtrl', {
                $scope: scope,
                repo: 'test',
                Pull: mockPullService,
                $modal: mockModal
            });
            return ctrl;
        };
        scope.repo = {};
        scope.pull = {head: {sha: 'abcd1234'}};
    }));

    it('should be default open', function() {
        var ctrl = createCtrl();
        (scope.type).should.be.exactly('open');
    });

    // Actions
    it('should open badge modal', function() {
        var ctrl = createCtrl();
        scope.badge();
    });

    it('should send an invite', function() {
        httpBackend.expect('/api/invitation/invite', JSON.stringify({
            user: 'gabe',
            repo: 'test',
            invitee: 'dfarr',
            email: 'thing@example.com'
        })).respond({
            value: true
        });
        var ctrl = createCtrl();
        scope.invite({login: 'dfarr'}, 'thing@example.com');
    });

    // UI Text

    it('should return single status text', function() {
        var fakePull = {statuses: {value: {statuses: [{description: 'hi'}], total_count: 1}}};
        var ctrl = createCtrl();
        (scope.statusTooltip(fakePull)).should.be.exactly('hi');
    });

    it('should return multiple status text', function() {
        var fakePull = {statuses: {value: {
            total_count: 2,
            statuses: [{description: 'hi', state: 'success'}, {description: 'yo', state: 'success'}]
        }}};
        var ctrl = createCtrl();
        (scope.statusTooltip(fakePull)).should.be.exactly('2 / 2 checks OK');
    });

    it('should get star users', function() {
        var ctrl = createCtrl();
        var fakePull = {};
        var emptyRes = scope.getStarUsers(fakePull);
        (emptyRes).should.be.exactly('No stars');

        var fakePull2 = {
            stars: [{name: 'gabe'}, {name: 'david'}]
        };
        var result = scope.getStarUsers(fakePull2);
        (result).should.be.exactly('gabe, david starred');
    });
});
