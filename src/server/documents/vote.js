
var mongoose = require('mongoose');
var withHelper = require('./with');

var VoteSchema = mongoose.Schema({
	repo: Number,
	comm: String,
	user: String,
	vote: String
});

VoteSchema.plugin(withHelper);

VoteSchema.index({
	repo: 1,
	comm: 1,
	user: 1
}, {
	unique: true
});

var Vote = mongoose.model('Vote', VoteSchema);

module.exports = {
	Vote: Vote
};