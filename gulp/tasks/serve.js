'use strict';
var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    browserSync = require('browser-sync'),
    bsConfig = require('../config').browserSync,
    runSequence = require('run-sequence');

var reload = browserSync.reload;

gulp.task('nodemon', function(cb) {
  var called = false;
  return nodemon({script: './app.js'})
    .on('start', function() {
      setTimeout(function() {
        reload({stream: false});
        cb();
      }, 3000);
    })
    .on('restart', function() {
      setTimeout(function(){
        reload({stream: false});
      }, 1000);
    });
});

gulp.task('browserSync', ['nodemon'], function() {
  browserSync.init({
    files: ['./src/**/*.*'],
    proxy: 'http://localhost:60000',
    port: 4000
  });
});

gulp.task('serve', ['browserSync']);
