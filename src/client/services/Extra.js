'use strict';

// *****************************************************
// Extra Factory
// *****************************************************

module.factory('Extra', ['$HUB', function($HUB) {

    var user, repo, collaborators;

    var emojis = $HUB.call('misc', 'emojis');

    var flags = [
        {label: 'fix', icon: 'octicon octicon-issue-opened text-warning', type: 'review'},
        {label: 'resolve', icon: 'octicon octicon-issue-opened text-warning', type: 'review'},
        {label: 'fixed', icon: 'octicon octicon-issue-closed text-primary', type: 'review'},
        {label: 'resolved', icon: 'octicon octicon-issue-closed text-primary', type: 'review'},
        {label: 'completed', icon: 'octicon octicon-issue-closed text-primary', type: 'review'},
        {label: 'star', icon: 'icon-ninja-star text-primary', type: 'star'},
        {label: 'ninjastar', icon: 'icon-ninja-star text-primary', type: 'star'}
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
