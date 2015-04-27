'use strict';
// settings test
describe('Add Repo (old) Directive', function() {

    var scope, elScope, repo, httpBackend, element, add;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $compile) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({});
        scope = $rootScope.$new();

        var addFake = function(obj) {
            (obj.done)();
        };

        element = $compile('<add-repo-old></add-repo-old>')(scope);
        scope.$digest();
        elScope = element.isolateScope();
        elScope.repos = [{id: 1234}, {id: 2345}];
        elScope.add = addFake;
        elScope.active = true;
    }));

    // should get all repos
    // should successfully add repo
    // should say contains successfully
    it('should add a repo with an adddate', function() {
        var resultRepo = [{id: 1234}, {id: 2345}, {id: 3456}];
        elScope.addRepo({id: 3456});
        ([elScope.active]).should.be.eql([null]);
        (elScope.repos[elScope.repos.length - 1]).should.have.property('adddate');
        (elScope.repos[elScope.repos.length - 1].id).should.be.exactly(3456);
        (elScope.search).should.be.empty;
        (elScope.show).should.be.false;
    });

    // it('should clear search results and send search request', function() {
    //     httpBackend.expect('POST', '/api/github/wrap', '{"obj":"search","fun":"repos","arg":' + JSON.stringify({
    //        q: 'test+in:name+fork:true+user:hello'
    //     }) + '}').respond({
    //         value: [123, 134, 123]
    //     });
    //     var results = [123, 134, 123];
    //     elScope.search();
    //     (elScope.results).should.be.empty;
    //     httpBackend.flush();
    // });

    it('should reset successfully', function() {
        elScope.reset();
        ([elScope.query]).should.be.eql([null]);
        (elScope.results).should.be.empty;
    });

});
