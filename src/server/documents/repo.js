var mongoose = require('mongoose');

var RepoSchema = mongoose.Schema({
    repo: Number,
    slack: {
        token: String,
        channel: String,
        events: {
            pull_request: {type: Boolean, default: true},
            star: {type: Boolean, default: true},
            merge: {type: Boolean, default: true}
        }
    },
    comment: {type: Boolean, default: true},
    threshold: {type: Number, min: 1, default: 1}
});

RepoSchema.methods.toJSON = function() {
  var repo = this.toObject();
  repo.slack.token = !!repo.slack.token;
  return repo;
};

var Repo = mongoose.model('Repo', RepoSchema);

module.exports = {
    Repo: Repo
};
