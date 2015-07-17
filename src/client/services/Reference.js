'use strict';

// *****************************************************
// Reference Factory
// *****************************************************

module.factory('Reference', ['$stateParams', function($stateParams) {

    var regex = /([0-9a-fA-F]{40})\/(.*)R([0-9]+)/i;

    return {

        get: function(sha, path, position) {
            return sha + '/' + path + 'R' + position;
        },

        parse: function(ref) {
            ref = regex.exec(ref);
            return ref ? {sha: ref[1], path: ref[2], position: ref[3]} : null;
        },

        anchor: function(sha, path, position) {
            return sha + ':' + path + ':' + position;
        }
    };
}]);

