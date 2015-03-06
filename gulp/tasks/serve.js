var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    browserSync = require('browser-sync'),
    bsConfig = require('../config').browserSync,
    reload = browserSync.reload,
    runSequence = require('run-sequence');

gulp.task('nodemon', function() {
  var called = false;
  return nodemon({script: './app.js'})
    .on('restart', function() {
      setTimeout(function(){
        reload({stream: false});
      }, 4000);
    });
});

gulp.task('browserSync', ['nodemon'], function() {
  browserSync.init({
    files: ['./src/**/*.*'],
    proxy: "http://localhost:60000",
    port: 4000
  });

  gulp.watch(bsConfig.client).on('change', reload);
});

gulp.task('serve', ['browserSync']);
