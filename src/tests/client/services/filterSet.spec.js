// deep test
describe('Filter Set', function() {

    var filterSet;
    var objects;


    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.inject(['$FilterSet',
        function($FilterSet) {

            objects = [{
                fieldOne: 'abc',
                fieldTwo: '123',
                fieldThree: '!@#'
            }, {
                fieldOne: 'def',
                fieldTwo: '123',
                fieldThree: '---'
            }, {
                fieldOne: 'abc',
                fieldTwo: '456',
                fieldThree: '---'
            }];

            // Define filter set
            filterSet = $FilterSet();

            filterSet.define('some_object_type', 'fieldOne', function(objects, criteria) {

                var matched = [];
                objects.forEach(function(obj) {
                    if (obj.fieldOne == criteria) {
                        matched.push(obj);
                    }
                });
                return matched;
            });

            filterSet.define('some_object_type', 'fieldTwo', function(objects, criteria) {
                var matched = [];
                objects.forEach(function(obj) {
                    if (obj.fieldTwo == criteria) {
                        matched.push(obj);
                    }
                });
                return matched;
            });

            filterSet.define('some_object_type', 'fieldThree', function(objects, criteria) {
                var matched = [];
                objects.forEach(function(obj) {
                    if (obj.fieldThree == criteria) {
                        matched.push(obj);
                    }
                });
                return matched;
            });
        }
    ]));

    it('should filter by one criteria', function() {

        // Define data
        var result = filterSet.filter(objects, 'some_object_type').by('fieldOne', 'abc').getResult(function(output) {
            output.length.should.equal(2);
        });
    });


    it('should filter by two criterias', function() {

        // Define data
        var result = filterSet.filter(objects, 'some_object_type').by('fieldOne', 'abc').by('fieldTwo', '123').getResult(function(output) {
            output.length.should.equal(1);
        });
    });


    it('should filter by three criterias', function() {

        // Define data
        var result = filterSet.filter(objects, 'some_object_type').by('fieldOne', 'abc').by('fieldTwo', '123').by('fieldThree', '---').getResult(function(output) {
            output.length.should.equal(0);
        });
    });


    it('should filter again by two criterias', function() {

        // Define data
        var result = filterSet.filter(objects, 'some_object_type').by('fieldOne', 'abc').by('fieldTwo', '123').getResult(function(output) {
            output.length.should.equal(1);
        });
    });

    it('should not filter when null provided', function() {

        // Define data
        var result = filterSet.filter(objects, 'some_object_type').by('fieldOne', null).by('fieldTwo', null).by('fieldThree', null).getResult(function(output) {
            output.length.should.equal(3);
        });
    });
});
