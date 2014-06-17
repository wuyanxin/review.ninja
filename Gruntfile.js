
var CI = process.env.CI;

module.exports = function(grunt) {

	grunt.initConfig({

		// Server tests
		mochaTest: {
			server: {
				options: {
					reporter: (CI ? require('./src/tests/mocha.ninja.js') : undefined),
					captureFile: (CI ? './output/mochaTest/server.out' : undefined)
				},
				src: ['src/tests/server/**/*.js']
			}
		},

		// Client tests
		karma: {
			unit: {
				configFile: 'src/tests/karma.ninja.js'
			}
		},

		// JS Hint
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			server: {
				options: {
					reporter: (CI ? './src/tests/jshint.ninja.js' : undefined),
					reporterOutput: (CI ? './output/jshint/server.out' : undefined)
				},
				files: {
					src: ['app.js', 'src/server/**/*.js']
				}
			},
			client: {
				options: {
					reporter: (CI ? './src/tests/jshint.ninja.js' : undefined),
					reporterOutput: (CI ? './output/jshint/client.out' : undefined)
				},
				files: {
					src: ['src/client/**/*.js']
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['karma', 'jshint', 'mochaTest']);

};