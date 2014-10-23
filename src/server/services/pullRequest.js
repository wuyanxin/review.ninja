var url = require('./url');
var github = require('./github');

module.exports = {
    byLabels: function(labels) {
        var number = null;
        labels.forEach(function(label) {
            var regex = /pull-request-(\d*)?/;
            var match = regex.exec(label.name);
            if (match) {
                number = match[1];
            }
        });

        return number;
    },

    badgeComment: function(user, repo, repo_uuid, number) {
        var badgeUrl = url.pullRequestBadge(repo_uuid, number);
        var pullUrl = url.reviewPullRequest(user, repo, number);

        if(config.server.github.user) {
            github.call({
                obj: 'issues',
                fun: 'createComment',
                arg: {
                    user: user,
                    repo: repo,
                    number: number,
                    body: '[![ReviewNinja](' + badgeUrl + ')](' + pullUrl + ')'
                },
                basicAuth: {
                    user: config.server.github.user,
                    pass: config.server.github.pass
                }
            });
        }
    },

    setWatched: function(pulls, settings) {
        if(settings) {
            pulls.forEach(function(pull) {
                pull.watched = module.exports.isWatched(pull, settings);
            });
        }
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
