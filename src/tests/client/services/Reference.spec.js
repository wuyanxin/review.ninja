'use strict';
// settings test
describe('Reference Factory', function() {

    var scope, repo, httpBackend, Reference, sha, path, line;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        scope = $rootScope.$new();
        Reference = $injector.get('Reference');
        sha = 'sha';
        path = 'path';
        line = 0;
    }));

    // should get reference successfully
    it('should successfully get reference', function() {
        var result = Reference.get(sha, path, line);
        (result).should.be.exactly('sha/pathR0');
    });

    // should return anchor
    it('should return anchor', function() {
        var result = Reference.anchor(sha, path, line);
        (result).should.be.exactly(sha + ':' + path + ':' + line);
    });
});
