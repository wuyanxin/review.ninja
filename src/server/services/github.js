var GitHubApi = require('github');
module.exports = {

    call: function(call, done) {

        var obj = call.obj;
        var fun = call.fun;
        var arg = call.arg || {};
        var token = call.token;

        var github = new GitHubApi({
            protocol: config.github.protocol,
            version: config.github.version,
            host: config.github.api,
            pathPrefix: config.github.pathPrefix
        });

        // augument the client
        github.repos.one = function(msg, callback) {

            var self = github;

            self.httpSend(msg, {
                url: '/repositories/:id',
                params: {
                    '$id': null
                },
                method: 'get'
            }, function(err, res) {

                if (err) {
                    return callback(err);
                }

                var ret;

                try {
                    ret = res.data && JSON.parse(res.data);
                } catch (ex) {
                    return callback(ex);
                }

                if (!ret)
                    ret = {};
                if (!ret.meta)
                    ret.meta = {};
                ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-oauth-scopes', 'link', 'location', 'last-modified', 'etag', 'status'].forEach(function(header) {
                    if (res.headers[header])
                        ret.meta[header] = res.headers[header];
                });

                if (callback)
                    callback(null, ret);
            });
        };

        if(!obj || !github[obj]) {
            return done('obj required/obj not found');
        }

        if(!fun || !github[obj][fun]) {
            return done('fun required/fun not found');
        }

        if(token) {
            github.authenticate({
                type: 'oauth',
                token: token
            });
        }

        github[obj][fun](arg, function(err, res) {

            var meta = {};

            try {
                meta.link = res.meta.link;
                meta.hasMore = !!github.hasNextPage(res.meta.link);
                delete res.meta;
            } catch (ex) {
                meta = null;
            }

            done(err, res, meta);

        });

    }

};
