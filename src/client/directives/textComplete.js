'use strict';

// *****************************************************
// Text Complete Directive
// *****************************************************

module.directive('textComplete', ['$state', '$stateParams', 'Extra', function($state, $stateParams, Extra) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {

            var flags = Extra.flags(attrs.textComplete);
            var emojis = Extra.emojis();
            var collaborators = Extra.collaborators($stateParams.user, $stateParams.repo);

            $(elem[0]).textcomplete([{
                match: /\B:([\-+\w]+)$/,
                search: function(term, callback) {
                    callback($.map(emojis.value, function (image, emoji) {
                        return emoji.indexOf(term) === 0 ? {image: image, emoji: emoji} : null;
                    }));
                },
                replace: function(value) {
                    return ':' + value.emoji + ': ';
                },
                template: function(value) {
                    return '<img src="' + value.image + '" width="16px"></img> ' + value.emoji;
                },
                index: 1
            }, {
                match: /\B@([\-+\w]*)$/,
                search: function(term, callback) {
                    callback($.map(collaborators.value, function (collaborator) {
                        return collaborator.login.indexOf(term) === 0 ? collaborator : null;
                    }));
                },
                replace: function(value) {
                    return '@' + value.login + ' ';
                },
                template: function(value) {
                    return '<img src="' + value.avatar_url + '" width="18px"></img> ' + value.login;
                },
                index: 1
            }, {
                match: /\B!([\-+\w]*)$/,
                search: function(term, callback) {
                    callback($.map(flags, function (flag) {
                        return flag.label.indexOf(term) === 0 ? flag : null;
                    }));
                },
                replace: function(value) {
                    return '!' + value.label + ' ';
                },
                template: function(value) {
                    return value.icon + ' ' + value.label;
                },
                index: 1
            }]);
        }
    };
}]);
