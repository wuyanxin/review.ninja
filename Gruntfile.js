
var TRAVIS_COMMIT = process.env.TRAVIS_COMMIT;
var CI = process.env.CI;
var DEFAULT_FILE_ENCODING = "utf8";

var fs = require('fs');

module.exports = function(grunt) {

	var config = {

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
					reporter: (CI ? 'node_modules/jshint.ninja/index.js' : undefined),
					reporterOutput: (CI ? './output/jshint/server.out' : undefined)
				},
				files: {
					src: ['app.js', 'src/server/**/*.js']
				}
			},
			client: {
				options: {
					reporter: (CI ? 'node_modules/jshint.ninja/index.js' : undefined),
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
	};

	var post_url = 'http://review.ninja/vote/53a47fcff5663c4435b9666c/' + TRAVIS_COMMIT;
	console.log("Using post url " + post_url);

	if (CI) {
		config.http = {
			'post-mocha-results': {
				options: {
				  url: post_url,
				  method: 'POST'
				},
				files: {
					'report': 'output/mochaTest/server.out'
				}
			}
		};
	}

	// Initialize configuration
	grunt.initConfig(config);

	// Load NPM tasks
	grunt.loadNpmTasks('grunt-jsdox');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	if (CI) {
		grunt.loadNpmTasks('grunt-http');
	}

	// Register tasks
	grunt.registerTask('doc', ['jsdox']);

	var tasks = [];
	tasks.push('karma');
	tasks.push('jshint');
	tasks.push('mochaTest');

	if (CI) {
		tasks.push('http');
	}

	grunt.registerTask('default', tasks);

};
