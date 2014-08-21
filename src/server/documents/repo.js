var mongoose = require('mongoose');
var withHelper = require('./with');

var RepoSchema = mongoose.Schema({
    uuid: Number,
    token: String,
    ninja: Boolean
});

RepoSchema.plugin(withHelper);

var Repo = mongoose.model('Repo', RepoSchema);

module.exports = {
    Repo: Repo
};
