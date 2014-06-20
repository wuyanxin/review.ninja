
var CI = process.env.CI;

module.exports = function(grunt) {
	grunt.initConfig({

		// Server tests
		mochaTest: {
			server: {
				options: {
					reporter: (CI ? require('mocha.ninja') : undefined),
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
					reporter: (CI ? 'jshint.ninja' : undefined),
					reporterOutput: (CI ? './output/jshint/server.out' : undefined)
				},
				files: {
					src: ['app.js', 'src/server/**/*.js']
				}
			},
			client: {
				options: {
					reporter: (CI ? 'jshint.ninja' : undefined),
					reporterOutput: (CI ? './output/jshint/client.out' : undefined)
				},
				files: {
					src: ['src/client/**/*.js']
				}
			}
		},
		
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

	});

	grunt.loadNpmTasks('grunt-jsdox');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('doc', ['jsdox']);
	grunt.registerTask('default', ['karma', 'jshint', 'mochaTest']);

};
