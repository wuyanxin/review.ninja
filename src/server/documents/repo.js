
var mongoose = require('mongoose');

var RepoSchema = mongoose.Schema({
    uuid: Number,
    user: String,
    name: String,
    token: String,
    ninja: Boolean
});

RepoSchema.statics.with = function () {

	var keys;
	var args;
	var done;

	if(arguments.length == 2) {
		
		keys = arguments[0];
		done = arguments[1];

		return this.findOne(keys, done);
	}

	if(arguments.length == 3) {
		
		keys = arguments[0];
		args = arguments[1];
		done = arguments[2];

		return this.findOneAndUpdate(keys, args, {upsert: true}, done);
	}

	return done("Invalid arguments");
	
};

var Repo = mongoose.model('Repo', RepoSchema);

module.exports = {
	Repo: Repo
};