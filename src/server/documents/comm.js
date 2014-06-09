
var mongoose = require('mongoose');

var CommSchema = mongoose.Schema({
    uuid: Number,
    repo: String,
    status: String
});

var Comm = mongoose.model('Comm', CommSchema);

module.exports = {
	Comm: Comm
};