/**
 * Configuration Module
 *
 * @title config
 * @overview Configuration Module
 */
module.exports = {
    server: {
        github: {
            // optional
            protocol: process.env.GITHUB_PROTOCOL || 'https',
            host: process.env.GITHUB_HOST || 'github.com',
            api: process.env.GITHUB_API_HOST || 'api.github.com',
            enterprise: !!process.env.GITHUB_HOST, // flag enterprise version
            version: process.env.GITHUB_VERSION || '3.0.0',

            // required
            client: process.env.GITHUB_CLIENT,
            secret: process.env.GITHUB_SECRET,

            // review.ninja specific
            scopes: ['user:email', 'repo', 'repo:status', 'read:repo_hook', 'write:repo_hook', 'read:org', 'write:org'],
        },

        localport: process.env.PORT || 5000,

        http: {
            protocol: process.env.PROTOCOL || 'https',
            host: process.env.HOST || 'review.ninja',
            port: process.env.HOST_PORT
        },

        security: {
            sessionSecret: process.env.SESSION_SECRET || 'review.ninja',
            cookieMaxAge: 60 * 60 * 1000
        },

        smtp: {
            enabled: !!process.env.SMTP_HOST,
            host: process.env.SMTP_HOST,
            secureConnection: (process.env.SMTP_SSL && process.env.SMTP_SSL.downcase == 'true'),
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        },

        mongodb: {
            uri: process.env.MONGODB || 'mongodb://reviewninja:reviewninja@localhost:27017/reviewninja'
        },

        marketingPage: 'http://www.review.ninja/',

        static: [
            __dirname + '/bower',
            __dirname + '/client'
        ],

        api: [
            __dirname + '/server/api/*.js'
        ],

        webhooks: [
            __dirname + '/server/webhooks/*.js'
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
