
var sugar = require('array-sugar');
var validUrl = require('valid-url');
var request = require('request');

module.exports = exports = function(json) {

	this.json = json;

};

exports.prototype.approval = function(votes, done) {

	if( !(this.json && validUrl.isWebUri(this.json.approval)) ) {
		return done('Configuration is not valid url');
	}

	var approvals = [
		'pending', 
		'approved', 
		'rejected'
	];

	var approval = 'pending';

	request.post({url: this.json.approval, json: {votes: votes}}, function(err, res, body) {

		if(!err && res.statusCode===200 && approvals.contains(body)) {
			approval = body;
		}

		done(null, approval);
	});
};
