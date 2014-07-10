
var mongoose = require('mongoose');
var withHelper = require('./with');

var validate = require('../services/validate');

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

	return validate( this.ninja );

	// try {
	// 	json = JSON.parse(this.ninja);
	// 	return validate(json);
	// } catch (ex) {
	// 	return {
	// 		err: 'there was an error.',
	// 		data: null
	// 	};
	// }
});

var Comm = mongoose.model('Comm', CommSchema);

module.exports = {
	Comm: Comm
};