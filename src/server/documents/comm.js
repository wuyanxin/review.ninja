
var mongoose = require('mongoose');

var CommSchema = mongoose.Schema({
    uuid: String,
    user: String,
    repo: String,
    ninja: String,
    approval: Object
});

var Comm = mongoose.model('Comm', CommSchema);

module.exports = {
	Comm: Comm
};