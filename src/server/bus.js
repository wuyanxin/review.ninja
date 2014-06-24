
var mongoose = require('mongoose');
var github = require('./services/github');

module.exports = new (require('events').EventEmitter)();

module.exports.on('vote:add', function(vote) {

	console.log('vote:add');

	var mapping = {
		'approved': 'success',
		'rejected': 'failure',
		'pending': 'pending'
	};

	var approval = require('./services/approval');

	approval(vote.comm, function(err, approval) {
		// update database
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
		// update github status
		github.call({
			obj: 'statuses',
			fun: 'create',
			arg: {
				user: vote.user,
				repo: vote.repo,
				sha: vote.comm,
				state: mapping[approval],
				context: 'code-review/review.ninja',
				target_url: 'http://review.ninja/dtornow/review.ninja/sha'
			},
			token: vote.token
		}, function(err) {

		});
	});

});

module.exports.on('comm:approval', function(vote) {

	console.log('new approval', vote);

});