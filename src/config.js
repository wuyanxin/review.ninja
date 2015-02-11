/**
 * Configuration Module
 *
 * @title config
 * @overview Configuration Module
 */
module.exports = {

    terms: process.env.TERMS_URL,

    milestone_prefix: process.env.MILESTONE_PREFIX || '',

    server: {
        github: {
            // optional
            protocol: process.env.GITHUB_PROTOCOL || 'https',
            host: process.env.GITHUB_HOST || 'github.com',
            api: process.env.GITHUB_API_HOST || 'api.github.com',
            pathprefix: process.env.GITHUB_API_PATHPREFIX,
            version: process.env.GITHUB_VERSION || '3.0.0',
            port: process.env.GITHUB_PROTOCOL === 'http' ? 80 : 443,

            // required
            client: process.env.GITHUB_CLIENT,
            secret: process.env.GITHUB_SECRET,

            // required
            user: process.env.GITHUB_USER,
            pass: process.env.GITHUB_PASS,

            // review.ninja specific
            public_scope: ['user:email', 'public_repo', 'repo:status', 'read:repo_hook', 'write:repo_hook', 'read:org'],
            private_scope: ['user:email', 'repo', 'repo:status', 'read:repo_hook', 'write:repo_hook', 'read:org'],
            webhook_events: ['pull_request', 'issues', 'issue_comment', 'status']
        },

        localport: process.env.PORT || 5000,

        always_recompile_sass: process.env.NODE_ENV === 'production' ? false : true,

        http: {
            protocol: process.env.PROTOCOL || 'https',
            host: process.env.HOST || 'review.ninja',
            port: process.env.HOST_PORT
        },

        https: {
            certs: process.env.CERT
        },

        security: {
            sessionSecret: process.env.SESSION_SECRET || 'review.ninja',
            cookieMaxAge: 60 * 60 * 1000
        },

        smtp: {
            enabled: !!process.env.SMTP_HOST,
            host: process.env.SMTP_HOST,
            secure: (!!process.env.SMTP_SSL && process.env.SMTP_SSL === 'true'),
            port: process.env.SMTP_PORT || 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            name: 'review.ninja'
        },

        mongodb: {
            uri: process.env.MONGODB || process.env.MONGOLAB_URI
        },

        keen: {
            pid: process.env.KEENIO_PID,
            masterKey: process.env.KEENIO_MASTER_KEY,
            writeKey: process.env.KEENIO_WRITE_KEY,
            readKey: process.env.KEENIO_READ_KEY
        },

        papertrail: {
            host: process.env.PAPERTRAIL_HOST,
            port: process.env.PAPERTRAIL_PORT
        },

        static: {
            lib: [__dirname + '/bower'],
            app: [__dirname + '/client']
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
            __dirname + '/server/controller/default.js'
        ],

        middleware: [
            __dirname + '/server/middleware/*.js'
        ],

        passport: [
            __dirname + '/server/passports/*.js'
        ],

        karma: {
            modifiers: [
                { type: 'star', multiplier: 1 },
                { type: 'issue', multiplier: 1 },
                { type: 'repo', multiplier: 3 },
            ],
            ranks: [{
                title: 'Neonate',
                start: 1,
                end: 29,
                colour: '0xF8F7FA'
            }, {
                title: 'Initiate',
                start: 30,
                end: 59,
                colour: '0xFCFCA7'
            }, {
                title: 'Apprentice',
                start: 60,
                end: 89,
                colour: '0xFCC9A7'
            }, {
                title: 'Journeyman',
                start: 89,
                end: 119,
                colour: '0xB3DF93'
            }, {
                title: 'Journeyman',
                start: 120,
                end: 149,
                colour: '0xB3DF93'
            }, {
                title: 'Disciple',
                start: 150,
                end: 179,
                colour: '0x6E8EA2'
            }, {
                title: 'Expert',
                start: 180,
                end: 209,
                colour: '0x9366A6'
            }, {
                title: 'Veteran',
                start: 210,
                end: 239,
                colour: '0x5B3014'
            }, {
                title: 'Master',
                start: 240,
                end: 279,
                colour: '0xD60929'
            }, {
                title: 'Grandmaster',
                start: 280,
                end: 1000000,
                colour: '0x353131'
            }]
        }
    }

};
