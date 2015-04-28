'use strict';
// settings test
describe('Comment Factory', function() {

    var scope, repo, httpBackend, Comment;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $stateParams) {
        $stateParams.user = 'github';
        $stateParams.repo = 'gollum';

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({});

        scope = $rootScope.$new();

        Comment = $injector.get('Comment');
        scope.$digest();
    }));

    // should render comment if comment exists
    it('should render comment in proper html', function() {
        var comment = {
          body: 'Hello world github/linguist#1 **cool**, and #1!'
        };

        var renderedHTML = {
            body: 'Hello world github/linguist#1 **cool**, and #1!',
            html: '<p>Hello world <a href="https://github.com/github/linguist/issues/1" class="issue-link" title="Binary detection issues on extensionless files">github/linguist#1</a> <strong>cool</strong>, and <a href="https://github.com/gollum/gollum/issues/1" class="issue-link" title="no method to write a file?">#1</a>!</p>'
        };

        httpBackend.expect('POST', '/api/github/wrap', '{"obj":"markdown","fun":"render","arg":' + JSON.stringify({
          text: 'Hello world github/linguist#1 **cool**, and #1!',
          mode: 'gfm',
          context: 'github/gollum'
        }) + '}').respond({
            data: {
                body: '<p>Hello world <a href="https://github.com/github/linguist/issues/1" class="issue-link" title="Binary detection issues on extensionless files">github/linguist#1</a> <strong>cool</strong>, and <a href="https://github.com/gollum/gollum/issues/1" class="issue-link" title="no method to write a file?">#1</a>!</p>'
            }
        });

        var result = Comment.render(comment);
        httpBackend.flush();
        (result).should.be.eql(renderedHTML);
    });
    // should do markdown stuff

});
