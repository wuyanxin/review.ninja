'use strict';
// settings test
describe('Repo Controller', function() {

    var scope, repo, httpBackend, RepoCtrl;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller, $stateParams) {
        $stateParams.user = 'gabe';
        $stateParams.repo = 1234;
        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });

        httpBackend.expect('POST', '/api/github/call', '{"obj":"statuses","fun":"getCombined","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 1234,
          sha: 'abcd1234'
        }) + '}').respond({
            value: 'success'
        });

        httpBackend.expect('POST', '/api/github/wrap', '{"obj":"pullRequests","fun":"getAll","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 1234,
          state: 'open',
          per_page: 10
        }) + '}').respond({
            affix: [1, 2, 3, 4]
        });

        scope = $rootScope.$new();
        var RepoCtrl = $controller('RepoCtrl', {
            $scope: scope,
            repo: 1234
        });
        scope.repo = {};
        scope.pull = {head: {sha: 'abcd1234'}};
    }));

    it('should be default open', function() {
        (scope.type).should.be.exactly('open');
    });

    it('should get collaborators', function() {
        httpBackend.expect('POST', '/api/github/wrap', '{"obj":"repos","fun":"getCollaborators","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 1234,
        }) + '}').respond({
            value: ['david', 'dominik']
        });
        httpBackend.flush();
        (scope.collaborators).should.be.eql({value: ['david', 'dominik']});
    });

    it('should get open pull requests', function() {
        
    })

    /// UI Text

    it('should return single status text', function() {
        var fakePull = {status: {value: {statuses: [{description: 'hi'}], total_count: 1}}};
        (scope.statusTooltip(fakePull)).should.be.exactly('hi');
    });

    it('should return multiple status text', function() {
        var fakePull = {status: {value: {
            total_count: 2,
            statuses: [{description: 'hi', state: 'success'}, {description: 'yo', state: 'success'}]
        }}};
        (scope.statusTooltip(fakePull)).should.be.exactly('2 / 2 checks OK');
    });

    // create promise
    // get user and repo params
    // should change to error on statechangeerror
    // should create webhook
    // should send dismiss thing to server for user history

});