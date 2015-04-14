'use strict';

// *****************************************************
// Reference Factory
// *****************************************************

services.factory('Reference', ['$stateParams', function($stateParams) {

    var reference = function(sha, path, start, end) {
        return sha + '/' + path + '#L' + start + ((end && end !== start) ? '-L' + end : '');
    };

    var between = function(number, min, max) {
        return number >= min && number <= max;
    };

    return {
        get: function(sha, path, start, end) {
            return reference(sha, path, start, end);
        },

        select: function(sha, path, start, end) {
            if(end && end < start) {
                end = [start, start = end][0];
            }
            return {
                sha: sha,
                path: path,
                start: start,
                end: end,
                ref: reference(sha, path, start, end)
            };
        },

        starts: function(sha, path, line, ref) {
            return ref && sha === ref.sha && path === ref.path && line === ref.start;
        },

        includes: function(sha, path, line, ref) {
            return ref && sha === ref.sha && path === ref.path && (line === ref.start || between(line, ref.start, ref.end));
        },

        anchor: function(sha, path, line) {
            return sha + ':' + path + ':' + line;
        }
    };
}]);
