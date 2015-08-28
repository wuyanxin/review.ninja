'use strict';
// Karma configuration
// Generated on Wed Jun 04 2014 15:02:16 GMT-0700 (PDT)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../../',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'sinon'],

        // list of files / patterns to load in the browser
        files: [
            // Testing libs
            'src/bower/should/should.js',

            // Angular
            'http://cdn.socket.io/socket.io-1.0.4.js',
            'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.js',
            'http://cdnjs.cloudflare.com/ajax/libs/purl/2.3.1/purl.min.js',
            'http://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/js/bootstrap.min.js',
            'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular.js',
            'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular-sanitize.min.js',
            'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular-route.js',
            'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular-animate.min.js',
            'http://cdnjs.cloudflare.com/ajax/libs/angular-ui/0.4.0/angular-ui.min.js',
            'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.10/angular-ui-router.min.js',
            'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.13.0/ui-bootstrap-tpls.min.js',
            'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-utils/0.1.1/angular-ui-utils.min.js',
            'http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.6.0/moment.min.js',
            'http://cdnjs.cloudflare.com/ajax/libs/prism/0.0.1/prism.min.js',
            'http://www.google-analytics.com/analytics.js',
            'http://cdnjs.cloudflare.com/ajax/libs/angulartics/0.17.2/angulartics.min.js',
            'http://cdnjs.cloudflare.com/ajax/libs/angulartics/0.17.2/angulartics-ga.min.js',
            'src/bower/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
            'src/bower/angular-mocks/angular-mocks.js',
            'src/bower/angular-filter/dist/angular-filter.min.js',

            // Client code
            'src/client/modules/config.js',
            'src/client/app.js',
            'src/client/api.js',
            'src/client/controller/**/*.js',
            'src/client/directives/**/*.js',
            'src/client/filters/**/*.js',
            'src/client/interceptors/**/*.js',
            'src/client/services/**/*.js',

            // Client templates
            'src/client/**/*.html',

            // Tests
            'src/tests/client/**/*.js'
        ],


        // list of files to exclude
        exclude: [

        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/client/**/*.html': ['ng-html2js'],
            'src/client/**/*.js': ['coverage']
        },

        coverageReporter: {
            reporters: [{
                dir: './output/coverage/',
                subdir: 'client',
                type: 'lcov'
            }, {
                dir: './output/coverage/',
                subdir: 'client-html',
                type: 'html'
            }]
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: 'src/client',
            moduleName: 'templates'
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'coverage'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
