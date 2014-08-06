module.exports = function(grunt) {

    var config = {
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                files: {
                    'src/client/assets/styles/app.css' : 'src/client/assets/styles/app.css.scss'
                }
            }
        },
        watch: {
            css: {
                files: 'src/client/assets/styles/app.css.scss',
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

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('default', ['concurrent']);
};
