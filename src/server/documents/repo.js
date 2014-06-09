
var mongoose = require('mongoose');

var RepoSchema = mongoose.Schema({
    uuid: Number,
    user: String,
    name: String
});

var Repo = mongoose.model('Repo', RepoSchema);

module.exports = {
	Repo: Repo
};