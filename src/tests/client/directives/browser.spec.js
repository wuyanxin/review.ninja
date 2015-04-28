'use strict';
// settings test
describe('File Browser Directive', function() {

    var scope, repo, httpBackend, element, elScope;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $compile, $stateParams) {
        $stateParams.user = 'gabe';
        $stateParams.repo = 'test';

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({});

        var testTree = {
            tree: [
            {type: 'haha', path: 'test.txt'},
            {type: 'blob', path: 'test.png'}
            ]
        };
        httpBackend.expect('POST', '/api/github/call', '{"obj":"gitdata","fun":"getTree","arg":' + JSON.stringify({
           user: 'gabe',
           repo: 'test',
           sha: 'magic'
        }) + '}').respond({
            data: testTree
        });

        scope = $rootScope.$new();
        scope.sha = 'magic';
        element = $compile('<browser sha=\"sha\"></browser>')(scope);
        scope.$digest();
        elScope = element.isolateScope();
    }));

    // should watch git data
    it('should change stack and path upon new sha', function() {
        httpBackend.flush();
        (elScope.tree).should.containDeep({
            tree: [
            {type: 'haha', path: 'test.txt'},
            {type: 'image', path: 'test.png'}
            ]
        });
    });

    // should successfully pop from stack
    it('should pop successfully from stack', function() {
        elScope.stack = [{tree: {test: 'func'}}];
        elScope.path = ['test', 'path'];
        elScope.up();
        ([elScope.file]).should.be.eql([null]);
        (elScope.path).should.be.eql(['test']);
        (elScope.tree).should.be.eql({tree: {test: 'func'}});
        (elScope.stack).should.be.empty;
    });

    // should do nothing if stack is empty
    it('should do nothing if stack is empty', function() {
        elScope.stack = [];
        var result = elScope.up();
        ([result]).should.be.eql([undefined]);
    });

    // should push onto stack
    it('should push tree onto stack', function() {
        var testTree = {
            tree: [
            {type: 'haha', path: 'test.txt'},
            {type: 'image', path: 'test.png'}
            ]
        };
        httpBackend.expect('POST', '/api/github/call', '{"obj":"gitdata","fun":"getTree","arg":' + JSON.stringify({
           user: 'gabe',
           repo: 'test',
           sha: 'magic'
        }) + '}').respond({
            data: testTree
        });

        elScope.path = [];
        elScope.stack = [];
        elScope.down({type: 'tree', path: 'testpath', sha: 'magic'});
        httpBackend.flush();
        (elScope.path).should.be.eql(['testpath']);
        (elScope.stack).should.containDeep([testTree]);
        (elScope.tree).should.containDeep({
            tree: [
            {type: 'haha', path: 'test.txt'},
            {type: 'image', path: 'test.png'}
            ]
        });
    });

    it('should push file onto stack', function() {
        var testTree = {
            tree: [
            {type: 'haha', path: 'test.txt'},
            {type: 'image', path: 'test.png'}
            ]
        };
        httpBackend.expect('POST', '/api/github/wrap', '{"obj":"gitdata","fun":"getBlob","arg":' + JSON.stringify({
           user: 'gabe',
           repo: 'test',
           sha: 'magic'
        }) + '}').respond({
            data: 'test.png'
        });

        elScope.path = [];
        elScope.stack = [];
        elScope.down({type: 'file', path: 'test.png', sha: 'magic'});
        httpBackend.flush();
        (elScope.path).should.be.eql(['test.png']);
        (elScope.stack[0].tree[0]).should.containDeep(testTree.tree[0]);
        (elScope.stack[0].tree[1]).should.containDeep(testTree.tree[1]);
        (elScope.file).should.be.exactly('test.png');
    });

});
