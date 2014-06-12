
module.exports = function(config, votes, done) {

	if(	!(config && config.approval && typeof config.approval.approved === 'number') ||
		!(config && config.approval && typeof config.approval.rejected === 'number') ) {
		return done("Configuration invalid");
	}

	var sum = 0;
	
	votes.forEach(function(v) {
		sum += parseInt(v.vote, 10);
	});

	var approval = "pending";

	if(sum >= config.approval.approved) {
		approval = "approved";
	}

	if(sum <= config.approval.rejected) {
		approval = "rejected";
	}

	done(null, approval);

};