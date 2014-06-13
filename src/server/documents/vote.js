
var mongoose = require('mongoose');

var VoteSchema = mongoose.Schema({
	repo: Number,
	comm: String,
	user: String,
	vote: String
});


VoteSchema.index({
	repo: 1,
	comm: 1,
	user: 1
}, {
	unique: true
});


VoteSchema.post('save', function () {

	var comm = this.comm;

	var approval = require('../services/approval');

	approval(this.comm, function(err, approval) {

		mongoose.model('Comm').update({uuid: comm}, {approval: approval}, function(err, count) {

		});

	});

});


var Vote = mongoose.model('Vote', VoteSchema);


module.exports = {
	Vote: Vote
};