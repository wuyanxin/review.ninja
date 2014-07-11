
var mongoose = require('mongoose');
var withHelper = require('./with');

var CommSchema = mongoose.Schema({
    uuid: String,
    user: String,
    repo: String,
    ninja: String,
    approval: Object
});

CommSchema.plugin(withHelper);

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