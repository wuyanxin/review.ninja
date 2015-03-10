'use strict';
var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    karma = require('karma').server,
    config = require('../config').tests,
    runSequence = require('run-sequence');

// client-side tests
gulp.task('karma', function(done) {
  return karma.start({
    configFile: __dirname + '/../../' + config.karmaSrc,
    singleRun: true
  }, done);
});

// server-side tests
gulp.task('mocha', function() {
  return gulp.src(config.mochaSrc)
    .pipe(mocha());
});

gulp.task('test', function(callback) {
  runSequence('karma', 'mocha', callback);
});
