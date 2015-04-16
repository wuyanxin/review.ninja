'use strict';
// settings test
describe('Merge Directive', function() {

    var scope, repo, httpBackend, element, elScope;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $compile, $stateParams) {
        $stateParams.user = 'gabe';
        $stateParams.repo = 1234;

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });

        scope = $rootScope.$new();
        element = $compile("<merge></merge>")(scope);
        scope.$digest();
        elScope = element.isolateScope();
    }));

    // should watch git data
    it('should change stack and path upon new sha', function() {
        // var testTree = {
        //     tree: [
        //     {type: 'haha', path: 'test.txt'}, 
        //     {type: 'blob', path: 'test.png'}
        //     ]
        // };
        // httpBackend.expect('POST', '/api/github/call','{"obj":"gitdata","fun":"getTree","arg":' + JSON.stringify({
        //    user: 'gabe',
        //    repo: 1234,
        //    sha: 'magic'
        // }) + '}').respond({
        //     value: testTree
        // });

        // elScope.sha = 'magic';
        // scope.$digest();
        // elScope.$apply();

        // (elScope.stack).should.be.empty;
        // (elScope.path).should.be.empty;
        // httpBackend.flush();
        // (elScope.tree).should.be.eql({
        //     tree: [
        //     {type: 'haha', path: 'test.txt'}, 
        //     {type: 'image', path: 'test.png'}
        //     ]
        // });
        elScope.permissions = {push: true};
        elScope.pull = {stars: [1,2,3], 
            head: {repo: {id: 1}, ref: 'thing'},
            base: {repo: {id: 1}, ref: 'lol'}};
        elScope.reposettings = {value: {threshold: 3}};
        httpBackend.expect('POST', '/api/github/call','{"obj":"gitdata","fun":"getReference","arg":' + JSON.stringify({
           user: 'gabe',
           repo: 1234,
           ref: 'heads/thing'
        }) + '}').respond({
            value: [1,2,3]
        });
    });

    // should successfully pop from stack
    it('should get star text', function() {

    });

    // should do nothing if stack is empty
    it('should do nothing if stack is empty', function() {
        // elScope.stack = [];
        // var result = elScope.up();
        // ([result]).should.be.eql([undefined]);
    });

    // should push onto stack
    it('should push tree onto stack', function() {
        // var testTree = {
        //     tree: [
        //     {type: 'haha', path: 'test.txt'}, 
        //     {type: 'blob', path: 'test.png'}
        //     ]
        // };
        // httpBackend.expect('POST', '/api/github/call','{"obj":"gitdata","fun":"getTree","arg":' + JSON.stringify({
        //    user: 'gabe',
        //    repo: 1234,
        //    sha: 'magic'
        // }) + '}').respond({
        //     value: testTree
        // });
    });

    it('should push file onto stack', function() {
        // httpBackend.expect('POST', '/api/github/wrap','{"obj":"gitdata","fun":"getBlob","arg":' + JSON.stringify({
        //    user: 'gabe',
        //    repo: 1234,
        //    sha: 'magic'
        // }) + '}').respond({
        //     value: 'test.png'
        // });
    });

    it('should confirm', function() {

    });

});
