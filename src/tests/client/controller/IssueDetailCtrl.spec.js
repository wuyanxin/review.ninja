'use strict';
// settings test
describe('Issue Detail Controller', function() {

    var scope, rootScope, httpBackend, createCtrl, CommentMock;

    beforeEach(angular.mock.module('app'));
    beforeEach(angular.mock.module('templates'));

    beforeEach(function() {
        CommentMock = {
            render: function(comment) {
                return comment;
            }
        };
    });

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller, $stateParams) {
        $stateParams.user = 'gabe';
        $stateParams.repo = 'test';
        $stateParams.issue = 1;

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });

        httpBackend.expect('POST', '/api/github/call', '{"obj":"issues","fun":"getComments","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'test',
          number: 1
        }) + '}').respond(200, {
            data: [{body: 'thing'}, {body: 'wow'}]
        });

        scope = $rootScope.$new();
        scope.$parent = {
            $parent: {
                sha: 'magic'
            }
        };

        scope.compComm = function(sha) {
            return true;
        };

        rootScope = $rootScope;
        var repo = {
            value: {
                id: 1234
            }
        };
        var issue = {
            value: {
                body: '|commit|file reference|pull request|   |\r\n' +
                '|------|--------------|------------|---|\r\n' +
                '|abcdabcd12341234abcdabcd12341234abcdabcd|[culture#L1](https://github.com/reviewninja/foo/blob/abcdabcd12341234abcdabcd12341234abcdabcd/culture#L1)| #1 |[![#1](http://app.review.ninja/assets/images/icon-alt-36.png)](http://app.review.ninja/reviewninja/foo/pull/1)|'
            },
            sha: 'abcdabcd12341234abcdabcd12341234abcdabcd',
            path: 'https://github.com/reviewninja/foo/blob/abcdabcd12341234abcdabcd12341234abcdabcd/culture#L1',
            line: '#1'
        };

        createCtrl = function() {
            var ctrl = $controller('IssueDetailCtrl', {
                $scope: scope,
                $rootScope: rootScope,
                repo: repo,
                issue: issue,
                Comment: CommentMock
            });
            return ctrl;
        };
    }));

    it('should test if stuff is created', function() {
        var IssueDetailCtrl = createCtrl();
        (scope.repo).should.be.eql({id: 1234});
    });

    it('should return anchor correctly', function() {
        var IssueDetailCtrl = createCtrl();
        var result = scope.anchor();
        (result).should.be.exactly('abcdabcd12341234abcdabcd12341234abcdabcd:culture:1');
    });

    it('should set state to open if opened', function() {
        scope.issue = {number: 1, state: 'open'};
        var IssueDetailCtrl = createCtrl();

        httpBackend.expect('POST', '/api/github/call', '{"obj":"issues","fun":"edit","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'test',
          state: 'open'
        }) + '}').respond({
            data: {}
        });
        scope.setState();
    });

    it('should set status text correctly based on comments', function() {
        scope.comment = null;
        var IssueDetailCtrl = createCtrl();
        var result = scope.statustext();
        (result).should.be.exactly('Reopen issue');
        scope.comment = 'comment';
        var result2 = scope.statustext();
        (result2).should.be.exactly('Reopen and comment');
        scope.issue.state = 'open';
        var result3 = scope.statustext();
        (result3).should.be.exactly('Close and comment');
        scope.comment = null;
        var result4 = scope.statustext();
        (result4).should.be.exactly('Close issue');
    });

});
