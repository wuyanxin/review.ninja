'use strict';

var url = require('./url');
var github = require('./github');

var Repo = require('mongoose').model('Repo');
var Star = require('mongoose').model('Star');

var reference = function(sha, path, position) {
    return sha + '/' + path + '#L' + position;
};

module.exports = {

    status: function(args, done) {

        var negative = /(!fix)|(!resolve)/i;
        var positive = /(!fixed)|(!resolved)|(!completed)/i;

        Star.count({repo: args.repo_uuid, sha: args.sha}, function(err, stars) {

            stars = stars || 0;

            github.call({
                obj: 'pullRequests',
                fun: 'getComments',
                arg: {
                    user: args.user,
                    repo: args.repo,
                    number: args.number,
                    per_page: 100
                },
                token: args.token,
                basicAuth: args.basicAuth
            }, function(err, comments) {
                
                comments = comments || [];

                var status = {};
                var issues = {open: 0, closed: 0};

                comments.forEach(function(comment) {

                    var ref = reference(comment.original_commit_id, comment.path, comment.original_position);

                    if(comment.body.match(negative)) {
                        status[ref] = 1;
                    }

                    if(comment.body.match(positive)) {
                        status[ref] = 0;
                    }

                });

                for(var ref in status) {
                    issues.open = issues.open + status[ref];
                    issues.closed = issues.closed + !status[ref] ? 1 : 0;
                }

                done(null, {
                    stars: stars,
                    issues: issues
                });
            });
        });

    },

    badgeComment: function(user, repo, repo_uuid, number) {

        Repo.findOneAndUpdate({
            repo: repo_uuid
        }, {}, {
            new: true,
            upsert: true
        }, function(err, settings) {

            if(!err && settings && settings.comment && config.server.github.user) {

                var badgeUrl = url.pullRequestBadge(repo_uuid, number);
                var pullUrl = url.reviewPullRequest(user, repo, number);

                var badgelink = '<a href="' + pullUrl + '" target="_blank"><img src="' + badgeUrl + '" alt="ReviewNinja"/>';

                github.call({
                    obj: 'issues',
                    fun: 'createComment',
                    arg: {
                        user: user,
                        repo: repo,
                        number: number,
                        body: badgelink
                    },
                    basicAuth: {
                        user: config.server.github.user,
                        pass: config.server.github.pass
                    }
                });
            }
        });
    },

    isWatched: function(pull, settings) {

        // by default we are watching all branches
        var watched = !settings.watched.length;

        settings.watched.forEach(function(watch) {
            // escape all regex symbols except '*'
            var watchRegex = watch.replace(/[-[\]{}()+?.,\\^$|#\s]/g, '\\$&');
            // replace '*' with regex anything until next symbol (.*?)
            watchRegex = watchRegex.replace(/[*]/g, '(.*?)');
            var re = RegExp(watchRegex, 'g');
            if(re.exec(pull.base.ref) || re.exec(pull.head.ref)) {
                watched = true;
            }
        });
        return watched;
    }
};
