var TRAVIS_COMMIT = process.env.TRAVIS_COMMIT;
module.exports = function(grunt) {

    var config = {

        pkg: grunt.file.readJSON('package.json'),

        mocha_istanbul: {
            coverage: {
                src: 'src/tests/server', // the folder, not the files,
                options: {
                    coverage: true,
                    mask: '**/*.js',
                    coverageFolder: 'output/coverage'
                }
            }
        },

        coveralls: {
            mocha: {
                src: 'output/coverage/lcov.info'
            }
        },

        sass: {
            dist: {
                files: {
                    'src/client/assets/styles/app.css' : 'src/client/assets/styles/app.css.scss'
                }
            }
        },

        watch: {
            css: {
                files: 'src/client/assets/styles/*.scss',
                tasks: ['sass']
            }
        },

        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        nodemon: {
            debug: {
                script: 'app.js'
            }
        },

        // server tests
        mochaTest: {
            server: {
                src: ['src/tests/server/**/*.js']
            }
        },

        // client tests
        karma: {
            unit: {
                configFile: 'src/tests/karma.ninja.js'
            }
        },

        // jshint
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            app: {
                files: {
                    src: ['app.js', 'src/client/**/*.js', 'src/server/**/*.js', 'src/tests/**/*.js']
                }
            }
        }

    };

    // Initialize configuration
    grunt.initConfig(config);

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('serve', ['sass', 'concurrent']);
    grunt.registerTask('coverage', ['mocha_istanbul:coverage', 'coveralls:mocha']);
    grunt.registerTask('default', ['jshint', 'mochaTest', 'karma']);
};
