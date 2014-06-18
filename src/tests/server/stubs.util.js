
var sinon = require('sinon');
var github = require("../../server/services/github");

var fakeGithub = function () {


	var call = sinon.stub(github, "call", function (args, done) {

		var obj = args.obj;
		var fun = args.fun;

		var err = null;
		var res = null;

		if (fun == "getCommit") {
			res = {
				sha: args.arg.sha
			};
		}
		else if (fun == "createCommitComment") {
			// Nothing
		}
		done(err, res);
	});

	return {
		call: call
	};
};

module.exports = {
	fakeGithub: fakeGithub
};