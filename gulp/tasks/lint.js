'use strict';
var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    scsslint = require('gulp-scss-lint'),
    config = require('../config').lint,
    runSequence = require('run-sequence');

// eslint task for js files
gulp.task('eslint', function() {
  return gulp.src(config.esSrc)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
  });

// scss lint task
gulp.task('scsslint', function() {
  return gulp.src(config.scssSrc)
    .pipe(scsslint());
});

gulp.task('lint', function(callback) {
  runSequence('eslint', 'scsslint', callback);
});
