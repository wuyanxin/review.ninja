/**
 * Configuration Module
 *
 * @title config
 * @overview Configuration Module
 */
module.exports = {

    github: {

        // optional
        host: process.env.GITHUB_HOST,
        api: process.env.GITHUB_API_HOST,
        enterprise: !!process.env.GITHUB_HOST, // flag enterprise version

        // optional
        pathPrefix: process.env.GITHUB_PATH_PREFIX,
        protocol: process.env.GITHUB_PROTOCOL,
        version: process.env.GITHUB_VERSION || '3.0.0',

        // required
        client: process.env.GITHUB_CLIENT,
        secret: process.env.GITHUB_SECRET,
        callback: process.env.GITHUB_CALLBACK,

        // review.ninja specific
        scopes: ['user:email', 'repo', 'repo:status', 'read:repo_hook', 'write:repo_hook', 'read:org', 'write:org'],

        // optional urls
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
        '/hooks/approval'
    ],

    server: {

        http: {
            host: 'review.ninja',
            port: 80
        },

        smtp: {
            host: process.env.SMTP_HOST,
            secureConnection: true,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
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
