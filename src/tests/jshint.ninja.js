module.exports = {
	reporter: function (errors) {
		
		var comments = errors.map(function(e) {
			return {
				path: e.file,
				line: e.error.line,
				body: e.error.raw + "\n[JSHint " + e.error.code + "]",
			};
		});

		var issues = errors.map(function(e) {
			return {
				path: e.file,
				line: e.error.line,
				body: e.error.raw,
				title: e.error.raw + "\n[JSHint " + e.error.code + "]",
				labels: ["JSHint"]
			};
		});

		var vote = errors.length ? "-" : "+";

		console.log(JSON.stringify({
			comments: comments,
			issues: issues,
			vote: vote
		}));
	}
};