var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('serve', function() {
  nodemon({script: './app.js'})
    .on('change', function() {
      console.log('ehehe');
    })
    .on('restart', function() {
      console.log('restarted!');
    });
});