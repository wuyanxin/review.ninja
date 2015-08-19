'use strict';
var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    Server = require('karma').Server,
    config = require('../config').tests,
    runSequence = require('run-sequence');

// client-side tests
gulp.task('karma', function(done) {
  new Server({
    configFile: __dirname + '/../../' + config.karmaSrc,
    singleRun: true
  }, done).start();
});

// server-side tests
gulp.task('mocha', function() {
  return gulp.src(config.mochaSrc)
    .pipe(mocha());
});

gulp.task('test', function(callback) {
  runSequence('karma', 'mocha', callback);
});
