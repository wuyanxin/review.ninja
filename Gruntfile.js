module.exports = function(grunt) {

    var config = {

        pkg: grunt.file.readJSON('package.json'),

        mocha_istanbul: {
            coverage: {
                src: 'src/tests/server',
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
                    'src/client/assets/styles/app.css' : 'src/client/assets/styles/app.scss'
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

        eslint: {
            app: {
                files: {
                    src: ['*.js', 'src']
                }
            }
        },

        scsslint: {
            allFiles: [
              'src/client/assets/styles/*.scss'
            ],
            options: {
              config: '.scss-lint.yml',
              colorizeOutput: true
            }
        }
    };

    // Initialize configuration
    grunt.initConfig(config);

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('lint', ['eslint', 'scsslint']);
    grunt.registerTask('serve', ['sass', 'concurrent']);
    grunt.registerTask('coverage', ['mocha_istanbul:coverage', 'coveralls:mocha']);
    grunt.registerTask('default', ['eslint', 'mochaTest', 'karma']);
};
