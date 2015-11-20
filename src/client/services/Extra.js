'use strict';

// *****************************************************
// Extra Factory
// *****************************************************

module.factory('Extra', ['$HUB', function($HUB) {

    var user, repo, collaborators;

    var emojis = $HUB.call('misc', 'emojis');

    var flags = [
        {
            label: 'fix',
            type: 'review',
            icon: '<span class="fa fa-stack text-warning">\
                        <i class="fa fa-square-o fa-stack-1x" style="font-size: 20px;"></i>\
                        <i class="fa fa-exclamation fa-stack-1x" style="font-size: 12px;"></i>\
                    </span>'
        },
        {
            label: 'resolve',
            type: 'review',
            icon: '<span class="fa fa-stack text-warning">\
                        <i class="fa fa-square-o fa-stack-1x" style="font-size: 20px;"></i>\
                        <i class="fa fa-exclamation fa-stack-1x" style="font-size: 12px;"></i>\
                    </span>'
        },
        {
            label: 'fixed',
            type: 'review',
            icon: '<span class="fa fa-stack text-primary">\
                        <i class="fa fa-square-o fa-stack-1x" style="font-size: 20px;"></i>\
                        <i class="fa fa-check fa-stack-1x" style="font-size: 12px;"></i>\
                    </span>'
        },
        {
            label: 'resolved',
            type: 'review',
            icon: '<span class="fa fa-stack text-primary">\
                        <i class="fa fa-square-o fa-stack-1x" style="font-size: 20px;"></i>\
                        <i class="fa fa-check fa-stack-1x" style="font-size: 12px;"></i>\
                    </span>'
        },
        {
            label: 'completed',
            type: 'review',
            icon: '<span class="fa fa-stack text-primary">\
                        <i class="fa fa-square-o fa-stack-1x" style="font-size: 20px;"></i>\
                        <i class="fa fa-check fa-stack-1x" style="font-size: 12px;"></i>\
                    </span>'
        },
        {
            label: 'star',
            type: 'star',
            icon: '<span class="icon-ninja-star text-primary"></i>'
        },
        {
            label: 'ninjastar',
            type: 'star',
            icon: '<span class="icon-ninja-star text-primary"></i>'
        },
        {
            label: 'unstar',
            type: 'star',
            icon: '<span class="icon-ninja-star text-primary muted"></i>'
        }
    ];

    return {

        flags: function(type) {
            return $.map(flags, function(flag) {
                return type === flag.type ? flag : null;
            });
        },

        emojis: function() {
            return emojis;
        },

        collaborators: function(_user, _repo) {
            collaborators = user === _user && repo === _repo ? collaborators : $HUB.call('repos', 'getCollaborators', {
                user: _user,
                repo: _repo
            });

            user = _user;
            repo = _repo;

            return collaborators;
        }
    };
}]);
