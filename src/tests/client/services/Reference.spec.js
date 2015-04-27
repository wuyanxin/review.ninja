'use strict';
// settings test
describe('Reference Factory', function() {

    var scope, repo, httpBackend, sha, path, start, end, ref, altRef, Reference, line, line2, altLine, refObj;

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
        start = 0;
        end = 100;
        ref = 'sha/path#L0-L100';
        altRef = 'sha/path#L100';
        line = 0;
        line2 = 1;
        altLine = 'fail';
        refObj = {sha: 'sha', path: 'path', start: 0, end: 100};
    }));

    // should get reference successfully
    it('should successfully get reference', function() {
        var result = Reference.get(sha, path, start, end);
        (result).should.be.exactly(ref);
    });

    it('should reverse start and end if start is greater than end', function() {
        var result = Reference.get(sha, path, end, start);
        (result).should.be.exactly(altRef);
    });

    // should get selection
    it('should get a selection', function() {
        var result = Reference.select(sha, path, start, end);
        (result).should.eql({
            sha: sha,
            path: path,
            start: start,
            end: end,
            ref: ref
        });
    });

    // should return starts
    it('should return starts', function() {
        var result = Reference.starts(sha, path, line, refObj);
        (result).should.be.true;
    });

    // should return proper includes
    it('should return includes', function() {
        var result = Reference.includes(sha, path, line, refObj);
        (result).should.be.true;
    });

    it('should return includes for line number in between', function() {
        var result = Reference.includes(sha, path, line2, refObj);
        (result).should.be.true;
    });

    // should return anchor
    it('should return anchor', function() {
        var result = Reference.anchor(sha, path, line);
        (result).should.be.exactly(sha + ':' + path + ':' + line);
    });
});
