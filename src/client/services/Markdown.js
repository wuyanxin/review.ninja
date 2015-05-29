'use strict';

// *****************************************************
// Markdown Factory
// *****************************************************

module.factory('Markdown', ['$HUB', '$stateParams', function($HUB, $stateParams) {

    return {
        render: function(obj) {
            if(obj.body) {
                $HUB.wrap('markdown', 'render', {
                    text: obj.body,
                    mode: 'gfm',
                    context: $stateParams.user + '/' + $stateParams.repo
                }, function(err, markdown) {
                    if(!err) {
                        obj.html = markdown.value;
                    }
                });
            }

            return obj;
        }
    };
}]);
