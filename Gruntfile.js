
var TRAVIS_COMMIT = process.env.TRAVIS_COMMIT;
var CI = process.env.CI;
var DEFAULT_FILE_ENCODING = "utf8";

if (!TRAVIS_COMMIT && CI) {
	throw Error("You need to provide TRAVIS_COMMIT in order to use CI=true");
}


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

	// Tool IDs 
	var MOCHA_TOOL_ID = "53a47fcff5663c4435b9666c";
	var KARMA_TOOL_ID = "53a87bdd3df0d5ec4c4a7bd9";
	var JSHINT_CLIENT_TOOL_ID = "53a47fb9f5663c4435b9666a";
	var JSHINT_SERVER_TOOL_ID = "53a47fc5f5663c4435b9666b";


	if (CI) {
		config.http = {
			'post-mocha-results': {
				options: {
				  url: 'http://review.ninja/vote/' + MOCHA_TOOL_ID + '/' + TRAVIS_COMMIT,
				  method: 'POST'
				},
				files: {
					'report': 'output/mochaTest/server.out'
				}
			},
			'post-karma-results': {
				options: {
				  url: 'http://review.ninja/vote/' + KARMA_TOOL_ID + '/' + TRAVIS_COMMIT,
				  method: 'POST'
				},
				files: {
					'report': 'output/karma/client.out'
				}
			},
			'post-jshint-client-results': {
				options: {
				  url: 'http://review.ninja/vote/' + JSHINT_CLIENT_TOOL_ID + '/' + TRAVIS_COMMIT,
				  method: 'POST'
				},
				files: {
					'report': 'output/jshint/client.out'
				}
			},
			'post-jshint-server-results': {
				options: {
				  url: 'http://review.ninja/vote/' + JSHINT_SERVER_TOOL_ID + '/' + TRAVIS_COMMIT,
				  method: 'POST'
				},
				files: {
					'report': 'output/jshint/server.out'
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
	// Commented out, because reports won't work
	// if there is no output/karma/client.out file
	//grunt.registerTask('client', ['karma']);

	var defaultTasks = [];
	defaultTasks.push('jshint');
	defaultTasks.push('mochaTest');
	defaultTasks.push('karma');

	if (CI) {
		defaultTasks.push('http');
	}
	
	grunt.registerTask('default', defaultTasks);

};
