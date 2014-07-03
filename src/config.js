/**
 * Configuration Module
 *
 * @title config
 * @overview Configuration Module
 */
module.exports = {

	github: {
		host: process.env.GITHUB_HOST,
		pathPrefix: process.env.GITHUB_PATH_PREFIX,
		client: process.env.GITHUB_CLIENT,
		secret: process.env.GITHUB_SECRET,
		scopes: [],
		callback: process.env.GITHUB_CALLBACK,
		urls: {
			authorization: process.env.GITHUB_AUTHORIZATION_URL,
			token: process.env.GITHUB_TOKEN_URL,
			profile: process.env.GITHUB_PROFILE_URL
		}
	},

	mailchimp: {
		key: process.env.MAILCHIMP,
		news: 'fefbc1ceed',
		user: 'cee7e023eb'
	},

	whitelist: [
		'/chimp/add',
	],

	server: {

		http: {
			host: 'localhost',
			port: 60000,
		},

		static: [
			__dirname + '/bower',
			__dirname + '/client'
		],

		mongodb: {
			uri: process.env.MONGODB
		},

		api: [
			__dirname + '/server/api/*.js'
		],

		documents: [
			__dirname + '/server/documents/*.js'
		],

		controller: [
			__dirname + '/server/controller/!(default).js',
			__dirname + '/server/controller/default.js',
		],

		middleware: [
			__dirname + '/server/middleware/*.js'
		],

		passport: [
			__dirname + '/server/passports/*.js'
		]

	},

  client: {
    gacode: process.env.GACODE
  }

};
