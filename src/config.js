/**
 * Configuration Module
 *
 * @title config
 * @overview Configuration Module
 */
module.exports = {

	github: {
		client: process.env.GITHUB_CLIENT,
		secret: process.env.GITHUB_SECRET,
		scopes: [],
		callback: process.env.GITHUB_CALLBACK
	},

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

	}

};
