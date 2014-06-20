
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

	if (CI) {
		config.curl = {
			// 'post-jshint-client': {
			// 	src: {
			// 	  url: 'http://review.ninja/vote/53a47fb9f5663c4435b9666a/' + TRAVIS_COMMIT,
			// 	  method: 'POST',
			// 	  body: fs.readFileSync("output/jshint/client.out", DEFAULT_FILE_ENCODING).toString()
			// 	}
			// },
			// 'post-jshint-server': {
			// 	src: {
			// 	  url: 'http://review.ninja/vote/53a47fc5f5663c4435b9666b/' + TRAVIS_COMMIT,
			// 	  method: 'POST',
			// 	  body: fs.readFileSync("output/jshint/server.out", DEFAULT_FILE_ENCODING).toString()
			// 	}
			// },
			'post-mocha': {
				src: {
				  url: 'http://review.ninja/vote/53a47fcff5663c4435b9666c/' + TRAVIS_COMMIT,
				  method: 'POST',
				  body: fs.readFileSync("output/mochaTest/server.out", DEFAULT_FILE_ENCODING).toString()
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
		grunt.loadNpmTasks('grunt-curl');
	}

	// Register tasks
	grunt.registerTask('doc', ['jsdox']);

	var tasks = [];
	tasks.push('karma');
	tasks.push('jshint');
	tasks.push('mochaTest');

	if (CI) {
		tasks.push('curl');
	}

	grunt.registerTask('default', tasks);

};
