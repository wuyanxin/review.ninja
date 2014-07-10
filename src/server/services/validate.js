var assert = require('assert');


module.exports = function(json) {

	var ninja = {
		err: [],
		data: null
	};

	try {
		ninja.data = JSON.parse(json);

		if(	!(this.json && this.json.approval && typeof this.json.approval.approved === 'number') ||
			!(this.json && this.json.approval && typeof this.json.approval.rejected === 'number') ) {
			ninja.err.push('there was an errr.')
		}
	}
	catch(ex) {
		ninja.err.push('improper json');
	}

	return ninja;
};