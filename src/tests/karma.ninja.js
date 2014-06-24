// Karma configuration
// Generated on Wed Jun 04 2014 15:02:16 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      // Testing libs
      // TODO: CDN
      'src/bower/should/should.js',

      // Angular
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.js',
      'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/js/bootstrap.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.0-beta.8/angular.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.0-beta.8/angular-route.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular-ui/0.4.0/angular-ui.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.10/angular-ui-router.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.6.0/moment.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.0.1/js/bootstrap-switch.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/prism/0.0.1/prism.min.js',
      // TODO: CDN
      'src/bower/angular-mocks/angular-mocks.js',
      'src/bower/angular-bootstrap-switch/dist/angular-bootstrap-switch.js',
      'src/bower/angular-loggly-logger/angular-loggly-logger.js',

      // Client code
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
      'src/client/**/*.html' : ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/client',
      moduleName: 'templates'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'karma-reviewninja-reporter'],


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
