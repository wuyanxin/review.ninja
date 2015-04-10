'use strict';
// in test
describe('In Filter', function() {

    var deep;

    beforeEach(angular.mock.module('ninja.filters'));

    beforeEach(angular.mock.inject(function($filter) {
        deep = $filter('in');
    }));
    
    it('should match no items', function() {

        var items = [{
            name: 'one',
            deep: {
                val: true
            }
        }, {
            name: 'two',
            deep: {
                val: true
            }
        }, {
            name: 'three',
            deep: {
                val: true
            }
        }];

        var result = deep(items, 'deep.val', false);

        result.length.should.equal(0);
    });

});
