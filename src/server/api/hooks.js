
module.exports = {

	approval: function(req, done) {

		var approval = 'pending';

		var votes = req.args.votes;

		votes.forEach(function(v) {
			if(v.name === 'farrd' && v.vote.value > 0) {
				approval = 'approved';
			}
		});

		done(null, approval);
	}
		
};