'use strict';
// settings test
describe('Pull Controller', function() {

    var scope, rootScope, repo, httpBackend, createCtrl, PullCtrl, PullMock, IssueMock, MarkdownMock, FileMock, SocketMockFunc, SocketMock, ModalMock, q;

    beforeEach(angular.mock.module('app'));
    beforeEach(angular.mock.module('templates'));
    beforeEach(function() {
        //mock services
        PullMock = {
            milestone: function(pull) {
                return pull;
            },
            render: function(pull) {
                return pull;
            },
            stars: function(pull, bool) {
                return pull;
            }
        };

        IssueMock = {
            parse: function(issue) {
                return issue.body;
            }
        };

        MarkdownMock = {
            render: function(obj) {
                return obj;
            }
        };

        FileMock = {
            getFileTypes: function(files) {
                return files.map(function(x) { return x + '.test'; });
            }
        };

        SocketMockFunc = function($rootScope) {
            this.events = {};
            this.on = function(evt, cb) {
                if(!this.events[evt]) {
                    this.events[evt] = [];
                }
                this.events[evt].push(cb);
            };
            this.receive = function(evt) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (this.events[evt]) {
                    this.events[evt].forEach(function(cb){
                        $rootScope.$apply(function() {
                            cb.apply(this, args);
                        });
                    });
                }
            };
        };

        ModalMock = {
            open: function(obj) {
                return obj;
            }
        };
    });

    beforeEach(angular.mock.inject(function($injector) {
        // http requests
        httpBackend = $injector.get('$httpBackend');
        httpBackend.when('GET', '/config').respond({

        });

        httpBackend.expect('POST', '/api/github/call', '{"obj":"statuses","fun":"getCombined","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'test',
          sha: 'abcd1234'
        }) + '}').respond({
            value: 'success'
        });

        httpBackend.expect('POST', '/api/repo/get', JSON.stringify({
          repo_uuid: 1
        })).respond({
            value: 'success'
        });

        httpBackend.expect('POST', '/api/github/call', '{"obj":"issues","fun":"getComments","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'test',
          number: 1
        }) + '}').respond({
            data: [{body: 'test'},
            {body: 'this'}]
        });

        httpBackend.expect('POST', '/api/github/call', '{"obj":"issues","fun":"repoIssues","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'test',
          state: 'open',
          milestone: 1
        }) + '}').respond({
            data: [{body: 'test'},
            {body: 'this'}]
        });

        httpBackend.expect('POST', '/api/github/call', '{"obj":"issues","fun":"repoIssues","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'test',
          state: 'closed',
          milestone: 1
        }) + '}').respond({
            data: [{body: 'test'},
            {body: 'this'}]
        });
    }));


    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller, $stateParams, $q) {
        $stateParams.user = 'gabe';
        $stateParams.repo = 'test';
        $stateParams.number = 1;

        scope = $rootScope.$new();
        rootScope = $rootScope;

        q = $q;

        SocketMock = new SocketMockFunc($rootScope);

        var mockState = {
            go: function(fakestate, fakeparams) {
                var deferred = $q.defer();
                deferred.resolve({
                    value: true
                });
                var promise = deferred.promise;
                return promise;
            }
        };

        var fakePull = {
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
                sha: 'abcd1234'
            },
            milestone: {
                number: 1,
                id: 1234
            },
            body: 'hello world',
            number: 1,
            stars: [{name: 'gabe'}]
        };

        createCtrl = function() {
            var ctrl = $controller('PullCtrl', {
                $scope: scope,
                $rootScope: rootScope,
                $state: mockState,
                $modal: ModalMock,
                Pull: PullMock,
                Issue: IssueMock,
                Markdown: MarkdownMock,
                File: FileMock,
                repo: {value: {id: 1}},
                pull: {value: fakePull},
                socket: SocketMock
            });
            return ctrl;
        };
    }));

    // set all the stuff
    it('should set stuff', function() {
        PullCtrl = createCtrl();
        httpBackend.flush();
    });

    // star text
    it('should get star text', function() {
        var PullCtrl = createCtrl();
        scope.reposettings = {value: {threshold: 2}};
        var result = scope.getStarText();
        (result).should.be.exactly('Pull Request needs 1 more ninja star');
        scope.reposettings.value.threshold = 1;
        var result2 = scope.getStarText();
        (result2).should.be.exactly('No more ninja stars needed');
    });

    // compcomm
    it('should compare commits', function() {
        PullCtrl = createCtrl();
        httpBackend.expect('POST', '/api/github/wrap', '{"obj":"repos","fun":"compareCommits","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'test',
          base: 'master',
          head: 'testbranch'
        }) + '}').respond({
            data: {files: ['main', 'thing']}
        });
        scope.compComm('master', 'testbranch');
        httpBackend.flush();
        (scope.base).should.be.exactly('master');
        (scope.head).should.be.exactly('testbranch');
        (scope.files).should.be.eql(['main.test', 'thing.test']);
    });

    // set star on pr
    it('should set star', function() {
        PullCtrl = createCtrl();
        httpBackend.expect('POST', '/api/star/set', JSON.stringify({
            repo: 'test',
            user: 'gabe',
            sha: 'abcd1234',
            number: 1,
            repo_uuid: 11111
        })).respond({
            value: true
        });
        scope.setStar();
        httpBackend.flush();
    });

    // get pull request
    it('should get pull request', function() {
        PullCtrl = createCtrl();
        httpBackend.expect('POST', '/api/github/wrap', '{"obj":"pullRequests","fun":"get","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'test',
          number: 1
        }) + '}').respond({
            data: {head: {sha: 'abcd1234'}}
        });
        scope.getPullRequest();
        httpBackend.flush();
        (scope.pull).should.be.eql({head: {sha: 'abcd1234'}});
    });

    // create issue
    it('should create issue', function() {
        scope.title = 'lol';
        scope.description = 'thing';
        scope.reference = {selection: {ref: 'L1'}};
        httpBackend.expect('POST', '/api/issue/add', JSON.stringify({
            user: 'gabe',
            repo: 'test',
            sha: 'abcd1234',
            number: 1,
            repo_uuid: 11111,
            title: 'lol',
            body: 'thing'
        })).respond({
            value: true
        });
        var PullCtrl = createCtrl();
        scope.createIssue();
        httpBackend.flush();
        scope.$apply();
        scope.$digest();
        ([scope.show]).should.be.eql([null]);
        ([scope.title]).should.be.eql([null]);
        ([scope.description]).should.be.eql([null]);
        (scope.reference.selection).should.be.empty;
        (scope.creatingIssue).should.be.false;
    });

    // add comment
    it('should add comment', function() {
        scope.comment = 'lol';
        httpBackend.expect('POST', '/api/github/wrap', '{"obj":"issues","fun":"createComment","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'test',
          number: 1,
          body: 'lol'
        }) + '}').respond({
            value: true
        });
        var PullCtrl = createCtrl();
        scope.addComment();
        httpBackend.flush();
        ([scope.comment]).should.be.eql([null]);
    });

    // watch

    // badge modal
    it('should call to open modal', function() {
        var PullCtrl = createCtrl();
        scope.badge();
    });

    // all the socket functions
    // getting status via websocket
    it('should update status with websocket event', function() {
        var PullCtrl = createCtrl();
        scope.status = {};
        httpBackend.expect('POST', '/api/github/call', '{"obj":"statuses","fun":"getCombined","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'test',
          sha: 'abcd1234'
        }) + '}').respond({
            data: 'tested'
        });
        SocketMock.receive('gabe:test:status', {sha: 'abcd1234'});
        httpBackend.flush();
        (scope.status.value).should.be.exactly('tested');
    });

    // getting  stars via websocket
    it('should update stars websocket event', function() {
        var PullCtrl = createCtrl();
        scope.pull = {number: 1};
        SocketMock.receive('gabe:test:pull_request', {number: 1, action: 'starred'});
        (scope.pull).should.be.eql({number: 1});
        SocketMock.receive('gabe:test:pull_request', {number: 1, action: 'unstarred'});
        (scope.pull).should.be.eql({number: 1});
    });

    // should get closed pull request via websocket
    it('should trigger method to get a pull request upon websocket event', function() {
        var PullCtrl = createCtrl();
        var mock = sinon.mock(scope);
        var expectation = mock.expects('getPullRequest').thrice();
        SocketMock.receive('gabe:test:pull_request', {number: 1, action: 'closed'});
        SocketMock.receive('gabe:test:pull_request', {number: 1, action: 'reopened'});
        SocketMock.receive('gabe:test:pull_request', {number: 1, action: 'synchronize'});
        (mock.verify()).should.be.true;
        mock.restore();
    });

    // create comment event
    it('should push new comment with websocket event', function() {
        var PullCtrl = createCtrl();
        scope.comments = {value: []};
        httpBackend.expect('POST', '/api/github/call', '{"obj":"issues","fun":"getComment","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'test',
          id: 1234
        }) + '}').respond({
            data: {body: 'comment'}
        });
        SocketMock.receive('gabe:test:issue_comment', {number: 1, action: 'created', id: 1234});
        httpBackend.flush();
        (scope.comments.value).should.be.eql([{body: 'comment'}]);
    });

    // get open issues
    it('should get open issues with websocket event', function() {
        var PullCtrl = createCtrl();
        scope.open = {value: []};
        scope.pull = {number: 1};
        httpBackend.expect('POST', '/api/github/call', '{"obj":"issues","fun":"getRepoIssue","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'test',
          number: 1
        }) + '}').respond({
            data: {body: 'thing', milestone: 'testmile'}
        });
        SocketMock.receive('gabe:test:issues', {pull: 1, number: 1, action: 'opened'});
        httpBackend.flush();
        (scope.open.value).should.be.eql(['thing']);
        (scope.pull.milestone).should.be.exactly('testmile');
        (scope.pull).should.be.eql({number: 1, milestone: 'testmile'});
    });

    // changing closed issues to closed
    it('should change actually closed issues to closed upon receiving websocket call', function() {
        var fakeIssues = [
        {number: 1, state: 'open'},
        {number: 2, state: 'open'},
        {number: 3, state: 'open'}];
        var PullCtrl = createCtrl();
        scope.open = {value: fakeIssues};
        scope.closed = {value: []};
        SocketMock.receive('gabe:test:issues', {action: 'closed', pull: 1, number: 1});
        (scope.open.value).should.be.eql([{number: 2, state: 'open'}, {number: 3, state: 'open'}]);
        (scope.closed.value).should.be.eql([{number: 1, state: 'closed'}]);
    });

    // reopen closed issues on websocket event
    it('should changed closed issues to reopened on websocket event', function() {
        var fakeIssues = [
        {number: 1, state: 'closed'},
        {number: 2, state: 'closed'},
        {number: 3, state: 'closed'}];
        var PullCtrl = createCtrl();
        scope.closed = {value: fakeIssues};
        scope.open = {value: []};
        SocketMock.receive('gabe:test:issues', {action: 'reopened', pull: 1, number: 1});
        (scope.closed.value).should.be.eql([{number: 2, state: 'closed'}, {number: 3, state: 'closed'}]);
        (scope.open.value).should.be.eql([{number: 1, state: 'open'}]);
    });

});
