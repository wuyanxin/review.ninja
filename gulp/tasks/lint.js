'use strict';
var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    config = require('../config').lint,
    runSequence = require('run-sequence');

// eslint task for js files
gulp.task('eslint', function() {
  return gulp.src(config.esSrc)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
  });

// TODO: find a good gulp less linter

gulp.task('lint', function(callback) {
  runSequence('eslint', callback);
});
