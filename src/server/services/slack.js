'use strict';

var http = require('http');

var url = require('./url');
var github = require('./github');
var Repo = require('mongoose').model('Repo');
var Star = require('mongoose').model('Star');

module.exports = {
    notify: function(event, args) {

        if(config.server.slack.host) {

            Repo.findOneAndUpdate({
                repo: args.repo_uuid
            }).select('+slack.token').exec(function(err, repo) {

                var type = event !== 'unstar' ? event : 'star';

                if(!err && repo && repo.slack && repo.slack.token && repo.slack.events[type]) {

                    github.call({
                        obj: 'pullRequests',
                        fun: 'get',
                        arg: {
                            user: args.user,
                            repo: args.repo,
                            number: args.number
                        },
                        token: args.token
                    }, function(err, pull) {
                        if(!err) {
                            Star.count({sha: args.sha, repo: args.repo_uuid}, function(err, count) {
                                if(!err) {

                                    // add our data
                                    pull.stars = count;
                                    pull.threshold = repo.threshold;

                                    var req = http.request({
                                        host: config.server.slack.host,
                                        port: config.server.slack.port,
                                        path: config.server.slack.path,
                                        method: 'POST',
                                        headers: {'Content-Type': 'application/json'}
                                    });

                                    var data = {
                                        event: event,
                                        token: repo.slack.token,
                                        channel: repo.slack.channel,
                                        sender: args.sender,
                                        pull_request: pull,
                                        url: url.reviewPullRequest(args.user, args.repo, args.number)
                                    };

                                    req.write(JSON.stringify(data));
                                    req.end();
                                }
                            });


                        }
                    });
                }
            });

        }
    }
};
