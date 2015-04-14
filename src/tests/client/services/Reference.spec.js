'use strict';
// settings test
describe('Reference Factory', function() {

    var scope, repo, httpBackend, sha, path, start, end, ref, altRef, Reference, line, altLine;

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
        start = 'start';
        end = 'end';
        ref = 'sha/path#Lstart-Lend';
        altRef = 'sha/path#Lend-Lstart';
        line = 'start';
        altLine = 'fail';
    }));

    // should get reference successfully
    it('should successfully get reference', function() {
        var result = Reference.get(sha, path, start, end);
        (result).should.be.exactly(ref);
    });

    // should get selection
    it('should get a selection', function() {
        var result = Reference.select(sha, path, start, end);
        (result).should.be.exactly({
            sha: sha,
            path: path,
            start: start,
            end: end,
            ref: altRef
        });
    });

    // should return starts
    it('should return starts')
    // should return proper includes
    // should return anchor

});