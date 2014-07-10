
module.exports = exports = function(json) {

	this.json = json;

}

exports.prototype.approval = function(votes, done) {

	if(	!(this.json && this.json.approval && typeof this.json.approval.approved === 'number') ||
		!(this.json && this.json.approval && typeof this.json.approval.rejected === 'number') ) {
		return done('this.jsonuration invalid');
	}

	var sum = 0;
	
	votes.forEach(function(v) {
		sum += parseInt(v.vote, 10);
	});

	var approval = 'pending';

	if(sum >= this.json.approval.approved) {
		approval = 'approved';
	}

	if(sum <= this.json.approval.rejected) {
		approval = 'rejected';
	}

	done(null, approval);
}