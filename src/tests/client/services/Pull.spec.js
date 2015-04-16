'use strict';
// pull test
describe('Pull Factory', function() {

    var scope, httpBackend, Pull, pull, pull2;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $stateParams) {
        $stateParams.user = 'gabe';
        $stateParams.repo = 'repo1';

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });
        scope = $rootScope.$new();
        Pull = $injector.get('Pull');
        pull = {
            base: {
                repo: {
                    owner: {
                        login: 'gabe'
                    },
                    name: 'repo1',
                    id: 11111
                }
            },
            head: {
                sha: 'magic',
            },
            milestone: {
                number: '1.3.0',
                id: 1234
            },
            number: 1
        };
    }));

    // should change pull.milestone when calling api
    it('should change pull milestone when posting to api', function(){
        var pullMilestone = {
            base: {
                repo: {
                    owner: {
                        login: 'gabe'
                    },
                    name: 'repo1',
                    id: 11111
                }
            },
            head: {
                sha: 'magic'
            },
            milestone: {
                number: '1.4.0',
                id: 1234
            },
            number: 1
        };
        httpBackend.expect('POST', '/api/github/call', '{"obj":"issues","fun":"getMilestone","arg":' + JSON.stringify({
            user: 'gabe',
            repo: 'repo1',
            number: '1.3.0'
        }) + '}').respond({
            value: {
                number: '1.4.0',
                id: 1234
            }
        });
        var result = Pull.milestone(pull);
        httpBackend.flush();
        (result.milestone).should.eql({number: '1.4.0'});
        (result).should.eql(pullMilestone);
    });

    // should render pull body
    // it('should render pull body', function(){
    //     httpBackend.expect('POST', '/api/github/wrap', '{"obj":"markdown","fun":"render","arg":' + JSON.stringify({
    //       text: "Hello world github/linguist#1 **cool**, and #1!",
    //       mode: "gfm",
    //       context: "github/gollum"
    //     }) + '}').respond({
    //         value: {
    //             body: '<p>Hello world <a href="https://github.com/github/linguist/issues/1" class="issue-link" title="Binary detection issues on extensionless files">github/linguist#1</a> <strong>cool</strong>, and <a href="https://github.com/gollum/gollum/issues/1" class="issue-link" title="no method to write a file?">#1</a>!</p>'
    //         }
    //     });
    // });

    // // should get star count
    // it('should get star count', function(){
    //     httpBackend.expect('POST', '/api/github/wrap', '{"obj":"markdown","fun":"render","arg":' + JSON.stringify({
    //       sha: 'magic',
    //       repo_uuid: 11111
    //     }) + '}').respond({
    //         value: {
    //             body: '<p>Hello world <a href="https://github.com/github/linguist/issues/1" class="issue-link" title="Binary detection issues on extensionless files">github/linguist#1</a> <strong>cool</strong>, and <a href="https://github.com/gollum/gollum/issues/1" class="issue-link" title="no method to write a file?">#1</a>!</p>'
    //         }
    //     });
    // });

    // should get comments count
    it('should get comments count', function(){
        var pullComments = {
            base: {
                repo: {
                    owner: {
                        login: 'gabe'
                    },
                    name: 'repo1',
                    id: 11111
                }
            },
            head: {
                sha: 'magic',
            },
            milestone: {
                number: '1.3.0',
                id: 1234
            },
            number: 1,
            commentsCount: 5
        };

        httpBackend.expect('POST', '/api/github/call', '{"obj":"issues","fun":"getComments","arg":' + JSON.stringify({
            user: 'gabe',
            repo: 'repo1',
            number: 1,
            per_page: 10
        }) + '}').respond({
            value: ['these', 'are', 'some', 'test', 'comments']
        });
        var result = Pull.commentsCount(pull);
        httpBackend.flush();
        (result.commentsCount).should.be.exactly(5);
        (result).should.be.eql(pullComments);
    });
});
