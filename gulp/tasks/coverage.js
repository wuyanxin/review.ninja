'use strict';
var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    coveralls = require('gulp-coveralls'),
    istanbul = require('gulp-istanbul'),
    config = require('../config').coverage,
    runSequence = require('run-sequence'),
    merger = require('lcov-result-merger');

var istanbulOptions = {
  dir: './output/coverage/server',
  reporters: ['html', 'lcov']
};

gulp.task('coverage', function(cb) {
  runSequence('istanbul', 'karma', 'merge-all', 'coveralls', cb);
});

gulp.task('istanbul', function(cb) {
  gulp.src(config.istanbulSrc)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp.src(config.mochaSrc)
        .pipe(mocha())
        .pipe(istanbul.writeReports(istanbulOptions))
        .on('end', cb);
    });
});

gulp.task('merge-all', function() {
  return gulp.src('./output/coverage/*/lcov.info')
    .pipe(merger())
    .pipe(gulp.dest('./output/coverage/all/'));
});

gulp.task('coveralls', function() {
  return gulp.src('./output/coverage/all/lcov.info')
    .pipe(coveralls());
});
