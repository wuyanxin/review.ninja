'use strict';
// settings test
describe('Add Repo (new) Directive', function() {

    var scope, elScope, repo, httpBackend, element, add;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $compile) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });

        httpBackend.expect('POST', '/api/github/call','{"obj":"repos","fun":"getAll","arg":' + JSON.stringify({
           headers:{accept:'application/vnd.github.moondragon+json'},
           per_page:50
        }) + '}').respond({
            value: {
                repos: [123, 134, 123]
            }
        });

        scope = $rootScope.$new();

        var addFake = function(obj) {
            (obj.done)();
        };
        element = $compile("<add-repo-new></add-repo-new>")(scope);
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
        (elScope.repos[elScope.repos.length-1]).should.have.property('adddate');
        (elScope.repos[elScope.repos.length-1].id).should.be.exactly(3456);
        (elScope.search).should.be.empty;
        (elScope.show).should.be.false;
    });

    it('should check contains', function() {
        var result = elScope.contains(1234);
        var result2 = elScope.contains(9999);
        (result).should.be.true;
        (result2).should.be.false;
    });

});
