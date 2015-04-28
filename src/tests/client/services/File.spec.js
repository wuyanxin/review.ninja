'use strict';
// file factory test
describe('File Factory', function() {

    var scope, repo, httpBackend, File;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        scope = $rootScope.$new();

        File = $injector.get('File');
    }));

    // should change node to image if image
    it('should change node to image if image', function() {
        var tree = {tree: [{type: 'haha', path: 'test.txt'}, {type: 'blob', path: 'test.png'}]};
        var treeCorrect = {tree: [{type: 'haha', path: 'test.txt'}, {type: 'image', path: 'test.png'}]};
        var result = File.getTreeTypes(tree);
        (result).should.eql(treeCorrect);
    });

    // should get file types raw if image
    it('should get raw url of file and put it in file', function() {
        var files = [{filename: 'raw.png', raw_url: 'github.com/blah/raw.png'}];
        var filesCorrect = [{filename: 'raw.png', raw_url: 'github.com/blah/raw.png', image: 'github.com/blah/raw.png'}];
        var result = File.getFileTypes(files);
        (result).should.eql(filesCorrect);
    });
});
