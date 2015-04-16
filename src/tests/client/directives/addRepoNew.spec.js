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

        var addFake = function(repo, done) {
            done(null);
        };
        element = $compile("<add-repo-new></add-repo-new>")(scope);
        scope.$digest();
        elScope = element.isolateScope();
        console.log(elScope);
        elScope.repos = [{id: 1234}, {id: 2345}, {id: 3456}];
        elScope.add = addFake;
        console.log(elScope.repos);
    }));

    // should get all repos
    // should successfully add repo
    // should say contains successfully

    it('should check contains', function() {
        var result = elScope.contains(1234);
        var result2 = elScope.contains(9999);
        (result).should.be.true;
        (result2).should.be.false;
    });

});
