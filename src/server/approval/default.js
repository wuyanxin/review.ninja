
module.exports = function(config, votes, done) {

	var sum = 0;
	
	votes.forEach(function(v) {
		sum += v;
	});

	var approval = "";

	if(sum >= config.approval.approved) {
		approval = "approved";
	}

	if(sum <= config.approval.rejected) {
		approval = "rejected";
	}

	done(null, sum, approval);

};