'use strict';

module.exports = {
  browserSync: {
    client: 'src/client/*'
  },

  coverage: {
    istanbulSrc: 'src/server/**/*.js',
    mochaSrc: 'src/tests/server/**/*.js'
  },

  lint: {
    esSrc: ['*.js', 'src/**/*.js', 'gulp/**/*.js']
  },

  tests: {
    karmaSrc: 'src/tests/karma.ninja.js',
    mochaSrc: 'src/tests/server/*/**.js'
  }
};
