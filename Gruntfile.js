module.exports = function(grunt) {

    var config = {

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
        },

        // jsdox
        jsdox: {
            generate: {
                options: {
                    contentsEnable: true,
                    contentsTitle: 'Review.Ninja Documentation',
                    contentsFile: 'README.md'
                },

                src: [
                    'app.js',
                    'src/config.js',
                    'src/client/**/*.js',
                    'src/server/**/*.js',
                    'src/tests/**/*.js'
                ],

                dest: ['./doc']
            }
        }
    };

    // Initialize configuration
    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-jsdox');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint', 'mochaTest', 'karma', 'jsdox']);

};
