

var mongoose = require('mongoose');


var CommSchema = mongoose.Schema({
    uuid: String,
    user: String,
    repo: String,
    ninja: String,
    approval: Object
});


CommSchema.statics.with = function () {

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

	return done('Invalid arguments');
	
};


CommSchema.virtual('status').get(function () {
	return (this.approval === 'approved' || this.approval === 'rejected') ? this.approval : 'pending';
});

CommSchema.virtual('config').get(function () {
	try {
		return JSON.parse(this.ninja);
	} catch (ex) {
		return null;
	}
});

var Comm = mongoose.model('Comm', CommSchema);

module.exports = {
	Comm: Comm
};