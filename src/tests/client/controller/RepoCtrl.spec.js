'use strict';
// settings test
describe('Repo Controller', function() {

    var scope, repo, httpBackend, createCtrl;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller, $stateParams) {
        $stateParams.user = 'gabe';
        $stateParams.repo = 1234;
        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });

        httpBackend.expect('POST', '/api/github/wrap', '{"obj":"pullRequests","fun":"getAll","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 1234,
          state: 'open',
          per_page: 10
        }) + '}').respond({
            affix: [{head: {sha: 'abcd1234'}}]
        });

        httpBackend.expect('POST', '/api/github/wrap', '{"obj":"pullRequests","fun":"getAll","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 1234,
          state: 'closed',
          per_page: 10
        }) + '}').respond({
            affix: [{head: {sha: 'abcd1234'}}]
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

        scope = $rootScope.$new();
        createCtrl = function() {
            var ctrl = $controller('RepoCtrl', {
                $scope: scope,
                repo: 1234,
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

    it('should get open and closed pull requests', function() {
        var ctrl = createCtrl();
        httpBackend.flush();
        httpBackend.expect('POST', '/api/github/call', '{"obj":"statuses","fun":"getCombined","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 1234,
          sha: 'abcd1234'
        }) + '}').respond({
            value: 'success'
        });
        httpBackend.expect('POST', '/api/github/call', '{"obj":"statuses","fun":"getCombined","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 1234,
          sha: 'abcd1234'
        }) + '}').respond({
            value: 'success'
        });
        httpBackend.flush();
    });

    it('should get collaborators', function() {
        httpBackend.expect('POST', '/api/github/wrap', '{"obj":"repos","fun":"getCollaborators","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 1234
        }) + '}').respond({
            value: ['david', 'dominik']
        });
        var ctrl = createCtrl();
        httpBackend.flush();
        (scope.collaborators).should.be.eql({value: ['david', 'dominik']});
    });

    // Actions
    it('should open badge modal', function() {
        var ctrl = createCtrl();
        scope.badge();
    });

    it('should send an invite', function() {
        httpBackend.expect('/api/invitation/invite', JSON.stringify({
            user: 'gabe',
            repo: 1234,
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
        var fakePull = {status: {value: {statuses: [{description: 'hi'}], total_count: 1}}};
        var ctrl = createCtrl();
        (scope.statusTooltip(fakePull)).should.be.exactly('hi');
    });

    it('should return multiple status text', function() {
        var fakePull = {status: {value: {
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
