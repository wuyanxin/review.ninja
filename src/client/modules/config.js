'use strict';
// *****************************************************
// Ninja Config Module
// *****************************************************

angular.module('ninja.config', [])
    .provider('$config', function() {

        function Config($http) {
            this.get = function(done) {
                $http.get('/config')
                    .success(function(data, status) {
                        done(data || {}, status);
                    });
            };
        }

        this.$get = ['$http',
            function($http) {
                return new Config($http);
            }
        ];

        var url = $.url();

        this.log = url.param('log') === 'true' || document.location.hostname === 'localhost';
    });
