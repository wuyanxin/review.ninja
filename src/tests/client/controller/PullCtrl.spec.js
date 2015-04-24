'use strict';
// settings test
describe('Pull Controller', function() {

    var scope, rootScope, repo, httpBackend, createCtrl, PullCtrl, PullMock, IssueMock, CommentMock, FileMock, ModalMock, q;

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

            }
        };

        CommentMock = {
            render: function(comment) {

            }
        };

        FileMock = {
            getFileTypes: function(files) {
                return files.map(function(x) { return x + '.test'; });
            }
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
        }) + '}').respond([
            {body: 'test'},
            {body: 'this'}
        ]);

        httpBackend.expect('POST', '/api/github/call', '{"obj":"issues","fun":"repoIssues","arg":' + JSON.stringify({
          user: 'gabe',
          repo: 'test',
          state: 'open',
          milestone: 1
        }) + '}').respond({
            value: ['test'],
            affix: ['test', 'this']
        });

        httpBackend.expect('POST', '/api/github/call', '{"obj":"issues","fun":"repoIssues","arg":' + JSON.stringify({
          user: 'gabe',
          repo:'test',
          state: 'closed',
          milestone: 1
        }) + '}').respond({
            value: ['test'],
            affix: ['test', 'this']
        });
    }))


    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller, $stateParams, $q) {
        // mock socket
        $stateParams.user = 'gabe';
        $stateParams.repo = 'test';
        $stateParams.number = 1;

        scope = $rootScope.$new();
        rootScope = $rootScope;

        q = $q;

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
                sha: 'abcd1234',
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
                repo: {value: {id: 1}},
                pull: {value: fakePull}
            });
            return ctrl;
        }
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
            value: {files: ['main', 'thing']},
        });
        scope.compComm('master', 'testbranch');
        httpBackend.flush();
        (scope.base).should.be.exactly('master');
        (scope.head).should.be.exactly('testbranch');
        (scope.files).should.be.eql(['main.txt', 'thing.txt']);
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
            value: {head: {sha: 'abcd1234'}},
        });
        scope.getPullRequest();
        httpBackend.flush();
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
                sha: 'abcd1234',
            },
            milestone: {
                number: 1,
                id: 1234
            },
            body: 'hello world',
            number: 1
        };
        (scope.pull).should.be.eql(fakePull);
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

});
