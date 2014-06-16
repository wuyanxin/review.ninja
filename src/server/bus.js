
var mongoose = require('mongoose');

module.exports = new (require('events').EventEmitter)();

module.exports.on('vote:add', function(vote) {

	var approval = require('./services/approval');

	approval(vote.comm, function(err, approval) {
		if(approval === 'approved' || approval === 'rejected') {
			mongoose.model('Comm').findOne({uuid: vote.comm}, function(err, comm) {
				if(comm.approval !== approval) {
					comm.approval = approval;
					comm.save(function(err) {
						module.exports.emit('comm:approval', approval);
					});
				}
			});
		}

	});

});

module.exports.on('comm:approval', function(vote) {

	console.log("new approval", vote);

});