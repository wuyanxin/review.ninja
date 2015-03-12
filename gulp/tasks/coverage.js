'use strict';
var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    coveralls = require('gulp-coveralls'),
    istanbul = require('gulp-istanbul'),
    config = require('../config').coverage,
    runSequence = require('run-sequence');

var istanbulOptions = {
  dir: './output/coverage'
};

gulp.task('coverage', function(cb) {
  runSequence('istanbul', 'coveralls', cb);
});

gulp.task('istanbul', function(cb) {
  return gulp.src(config.istanbulSrc)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp.src(config.mochaSrc)
        .pipe(mocha())
        .pipe(istanbul.writeReports(istanbulOptions))
        .on('end', cb);
    });
});

gulp.task('coveralls', function() {
  return gulp.src('./output/coverage/lcov.info')
    .pipe(coveralls());
});
