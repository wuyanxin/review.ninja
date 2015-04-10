'use strict';
// in test
describe('In Filter', function() {

    var _in, items;

    beforeEach(angular.mock.module('ninja.filters'));

    beforeEach(angular.mock.inject(function($filter) {
        _in = $filter('in');
        items = [{
            'attr': 1
        }, {
            'attr': 2
        }, {
            'attr': 3
        }, 4];
    }));

    // should return items in array if array is not there
    // should push matched items to array
    
    it('should return all items if there is not match', function() {
        var array = [];

        var result = _in(items, array, 1);
        var result2 = _in(items, null, 1);

        result.should.be.exactly(items);
        result2.should.be.exactly(items);
    });

    it('should return matched items in an array', function() {
        var array = [2, 3, 4];
        var result = _in(items, array, 'attr');
        var result2 = _in(items, array, null);

        result.should.be.exactly([2, 3]);
        result2.should.be.exactly([4]);
    });

});
